// only valid goal properties has to be updated, other source properties to be ignored. Id should remain unchanged
export const updateGoalProperties = (target, source) =>
  ['title', 'targetDate', 'tags', 'type'].reduce((target, propertyName) => {
    if (propertyName in source) {
      target[propertyName] = source[propertyName]
    }
    return target
  }, target)
