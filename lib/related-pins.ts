import type { Pin } from "./types"

/**
 * Find related pins based on tags, title keywords, and category similarity
 */
export function findRelatedPins(currentPin: Pin, allPins: Pin[], limit = 12): Pin[] {
  // Exclude the current pin
  const otherPins = allPins.filter((pin) => pin.id !== currentPin.id)

  // Calculate relevance score for each pin
  const scoredPins = otherPins.map((pin) => {
    let score = 0

    // Match tags (highest weight)
    const matchingTags = pin.tags.filter((tag) => currentPin.tags.includes(tag))
    score += matchingTags.length * 10

    // Match title keywords
    const currentTitleWords = currentPin.title.toLowerCase().split(/\s+/)
    const pinTitleWords = pin.title.toLowerCase().split(/\s+/)
    const matchingWords = currentTitleWords.filter((word) => word.length > 3 && pinTitleWords.includes(word))
    score += matchingWords.length * 5

    // Same user (lower weight)
    if (pin.userId === currentPin.userId) {
      score += 2
    }

    // Boost popular pins slightly
    score += Math.log(pin.likes + 1) * 0.5

    return { pin, score }
  })

  // Sort by score and return top results
  return scoredPins
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.pin)
}
