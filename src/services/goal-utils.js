// only valid goal properties has to be updated, other source properties to be ignored. Id should remain unchanged
export const updateGoalProperties = (target, source) =>
  ['title', 'targetDate', 'tags', 'type', 'сompleted'].reduce((target, propertyName) => {
    if (propertyName in source) {
      target[propertyName] = source[propertyName]
    }
    return target
  }, target)

/**
 * find a goal in the goalList including children and return goal properties. Does not modify goalList and it's tree
 * @param {List<Goal>} goalList
 * @param {integer} goalId
 * @returns {goal: Goal, parent: Goal, index: integer}
 */
export function getGoalData(goalList, goalId) {
  let goal = null
  let parent = null
  let parentContainer = null
  let container = null
  let index = -1

  const searchFunc = (aGoal, i, aParent, aContainer, aParentContainer) => {
    if (aGoal.id == goalId) {
      goal = aGoal
      parent = aParent
      index = i
      container = aContainer
      parentContainer = aParentContainer
      return true
    }
    return aGoal.children?.some((child, i) =>
      searchFunc(child, i, aGoal, aGoal.children, aContainer)
    )
  }
  goalList.some((child, i) => searchFunc(child, i, null, goalList, null))
  return { goal, parent, index, container, parentContainer }
}

export function deleteGoal(container, id) {
  if (!container?.length) return null
  let index = container.findIndex((goal) => goal.id == id)
  if (index != -1) {
    const target = container[index]
    container.splice(index, 1)
    return target
  }
  return container.some((goal) => deleteGoal(goal?.children, id))
}

export function tree2list(tree, list = []) {
  tree.forEach((goal) => {
    const { children, ...goalData } = goal
    list.push(goalData)
    if (children?.length) {
      tree2list(children, list)
    }
  })
  return list
}
