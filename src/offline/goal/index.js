import Generator from '../services/generator'
import { quarterDate } from '../services/date-utils'
import { getGoalData } from '../services/goal-utils'

// only valid goal properties has to be updated, other source properties to be ignored. Id should remain unchanged
const updateGoalProperties = (target, source) =>
  ['title', 'targetDate', 'tags', 'type', 'completed'].reduce((target, propertyName) => {
    if (propertyName in source) {
      target[propertyName] = source[propertyName]
    }
    return target
  }, target)

function deleteGoal(container, id) {
  if (!container?.length) return null
  let index = container.findIndex((goal) => goal.id == id)
  if (index != -1) {
    const target = container[index]
    container.splice(index, 1)
    return target
  }
  return container.some((goal) => deleteGoal(goal?.children, id))
}

export default async function (context, req, goals) {
  // /POST /goal {title, [parentId], [type], [targetDate], [rank?/order?], [tags]}
  // /PUT /goal/$id/ {[title], [parentId], [type], [targetDate], [rank?/order?], [tags]}
  // TODO: add logic of moving the goal via changing it's parentId

  try {
    const goalData = req.body

    if (['PUT', 'POST'].includes(req.method) && !goalData) {
      context.res = {
        status: 204,
        body: 'no data was provided'
      }
      return
    }

    let goalContainer = goals.goals
    const goalId = req.query?.id

    switch (req.method) {
      case 'DELETE': {
        context.log(`Trying to delete the goal with id='${goalId}'`)

        let goalToDelete = deleteGoal(goalContainer, goalId)

        if (goalToDelete) {
          context.bindings.outGoals = goals
          context.res = {
            status: 200,
            body: `The goal '${JSON.stringify(goalToDelete)}' deleted`
          }
        } else {
          context.res = {
            status: 400,
            body: `Could not delete the goal with id='${goalId}' as it does not exist`
          }
        }
        break
      }
      case 'PUT': {
        context.log(
          `Trying to update the goal with id='${goalId}' with content='${JSON.stringify(goalData)}'`
        )

        let targetGoal = null
        let parentGoal = null

        const searchFunc = (goal, parent) => {
          if (goal.id == goalId) {
            targetGoal = goal
            parentGoal = parent
            return true
          }
          return goal?.children?.some((child) => searchFunc(child, goal))
        }

        if (goalContainer.some(searchFunc)) {
          if (!goalData.tags && !targetGoal.tags && parentGoal?.tags)
            goalData.tags = parentGoal.tags
          if (!goalData.targetDate && !targetGoal.targetDate && parentGoal?.targetDate)
            goalData.targetDate = quarterDate(parentGoal.targetDate)
          updateGoalProperties(targetGoal, goalData)
          context.bindings.outGoals = goals
          context.res = {
            status: 200,
            body: `The goal updated successfully. New content: '${JSON.stringify(targetGoal)}'`
          }
        } else {
          context.res = {
            status: 400,
            body: `Could not update the goal with id='${goalId}' as it does not exist`
          }
        }
        break
      }
      case 'POST': {
        let parentGoal = null
        if (goalData.parentId) {
          const searchFunc = (goal) => {
            if (goal.id == goalData.parentId) {
              parentGoal = goal
              return true
            }
            return goal?.children?.some(searchFunc)
          }
          if (goalContainer.some(searchFunc)) {
            if (!parentGoal.children) {
              parentGoal.children = []
            }
            goalContainer = parentGoal.children
          }
        }
        if (!goalData.tags && parentGoal?.tags) goalData.tags = parentGoal.tags
        if (!goalData.targetDate && parentGoal?.targetDate)
          goalData.targetDate = quarterDate(parentGoal.targetDate)
        const newGoal = updateGoalProperties({ id: Generator.getNewId() }, goalData)
        goalContainer.push(newGoal)

        context.res = {
          status: 200,
          body: JSON.stringify(newGoal)
        }
        context.bindings.outGoals = goals
        break
      }
      case 'PATCH': {
        const { goal, parent, index, container, parentContainer } = getGoalData(
          goalContainer,
          goalId
        )
        switch (req.query.action) {
          case 'moveUp': {
            if (index > 0) {
              parent.children.splice(index - 1, 2, goal, parent.children[index - 1])
            } else {
              context.res = {
                status: 400,
                body: `Could not move up the goal with id = '${goalId}', title = '${goal?.title}', index = ${index}`
              }
            }
            break
          }
          case 'levelUp': {
            if (parent && goal && parentContainer && index >= 0) {
              if (parent.children.length > 1) {
                parent.children.splice(index, 1)
              } else {
                delete parent.children
              }
              const parentIndex = parentContainer.findIndex((goal) => goal.id == parent.id)
              parentContainer.splice(parentIndex + 1, 0, goal)
            } else {
              context.res = {
                status: 400,
                body: `Could not level up the goal with id = '${goalId}', title = '${goal?.title}', index = ${index}`
              }
            }
            break
          }
          case 'levelDown': {
            if (index > 0) {
              let newParent = container[index - 1]
              if (!newParent.children) newParent.children = []
              newParent.children.push(goal)
              container.splice(index, 1)
            } else {
              context.res = {
                status: 400,
                body: `Could not level down the goal with id = '${goalId}', title = '${goal?.title}', index = ${index}`
              }
            }
            break
          }
          case 'complete': {
            goal.completed = req?.query?.value === false ? false : true // default is true
            break
          }
          default:
            context.res = {
              status: 400,
              body: `Not supported/specified PATCH action: '${req.query.action}'`
            }
        }
        context.bindings.outGoals = goals
        break
      }
      default:
        context.res = {
          status: 400,
          body: `'${req.method}' method is not supported`
        }
    }
  } catch (err) {
    context.log(err)
    context.res = {
      status: 404,
      body: err.toString()
    }
  }
}
