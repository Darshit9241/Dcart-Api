/**
 * Utility function to reset the "hasVisitedBefore" flag in localStorage
 * This can be used for testing the first-time visitor offer modal
 * 
 * Usage in browser console:
 * - Import this function in a component where you need it
 * - Call resetVisitorStatus() to clear the flag
 * - Refresh the page to see the offer modal again
 */
export const resetVisitorStatus = () => {
  localStorage.removeItem("hasVisitedBefore");
  console.log("Visitor status reset. Refresh the page to see the offer modal again.");
}; 