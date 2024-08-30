/**
 * find a goal in the goalList including children and return goal properties. Does not modify goalList and it's tree
 * @param {List<Goal>} goalList
 * @param {integer} goalId
 * @returns {goal: Goal, parent: Goal, index: integer}
 */
function getGoalData(goalList, goalId) {
  let goal = null;
  let parent = null;
  let parentContainer = null;
  let container = null;
  let index = -1;

  const searchFunc = (aGoal, i, aParent, aContainer, aParentContainer) => {
    if (aGoal.id == goalId) {
      goal = aGoal;
      parent = aParent;
      index = i;
      container = aContainer;
      parentContainer = aParentContainer
      return true;
    }
    return aGoal.children?.some((child, i) => searchFunc(child, i, aGoal, aGoal.children, aContainer));
  };
  goalList.some((child, i) => searchFunc(child, i, null, goalList, null));
  return { goal, parent, index, container, parentContainer };
}

module.exports = { getGoalData };
