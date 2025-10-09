export function computeProgress(items, responses) {
  const total = items.length;
  const answered = items.filter((item) => responses[item.id]).length;
  const correct = items.filter((item) => responses[item.id]?.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    answered,
    correct,
    accuracy,
  };
}
