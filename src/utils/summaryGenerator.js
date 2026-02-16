const generateSummary = (classification, reasons) => {
  if (!reasons || reasons.length === 0) {
    return "Weather conditions appear stable during the event window.";
  }

  const primaryReason = reasons[0];

  if (classification === "Unsafe") {
    return `Unsafe conditions detected: ${primaryReason}`;
  }

  if (classification === "Risky") {
    return `Elevated weather risk: ${primaryReason}`;
  }

  return "Favorable weather conditions expected.";
}

export default generateSummary;
