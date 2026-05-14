import { useReadingState } from "@/utils/useReadingState";
import { SpreadSelection } from "@/components/Reading/SpreadSelection";
import { OracleDeckSelection } from "@/components/Reading/OracleDeckSelection";
import { OracleResultScreen } from "@/components/Reading/OracleResultScreen";
import { ManualPickScreen } from "@/components/Reading/ManualPickScreen";
import { MethodSelection } from "@/components/Reading/MethodSelection";
import { ReadingResults } from "@/components/Reading/ReadingResults";

export default function ReadingScreen() {
  const {
    selectedSpread,
    setSelectedSpread,
    mode,
    setMode,
    drawnCards,
    setDrawnCards,
    isDrawing,
    showResults,
    setShowResults,
    savedId,
    saving,
    saveError,
    ambientEnabled,
    spreadFilter,
    setSpreadFilter,
    deckType,
    setDeckType,
    oracleResult,
    currentSpread,
    drawRandom,
    handleManualConfirm,
    saveReading,
    resetReading,
    toggleAmbient,
    drawOracleCard,
    resetOracle,
    moonPhaseName,
  } = useReadingState();

  // Oracle Result Screen
  if (deckType === "oracle" && oracleResult) {
    return (
      <OracleResultScreen
        oracleResult={oracleResult}
        onDrawAnother={() => drawOracleCard()}
        onSwitchToTarot={() => {
          setDeckType("tarot");
          resetOracle();
        }}
        onBack={resetOracle}
      />
    );
  }

  // Oracle Deck Selection
  if (deckType === "oracle" && !oracleResult) {
    return (
      <OracleDeckSelection
        onSelectDeck={drawOracleCard}
        onSwitchToTarot={() => setDeckType("tarot")}
      />
    );
  }

  // Manual Pick Screen
  if (mode === "manual" && !showResults) {
    return (
      <ManualPickScreen
        spread={currentSpread}
        onConfirm={handleManualConfirm}
        onBack={() => setMode(null)}
      />
    );
  }

  // Spread Selection
  if (!selectedSpread) {
    return (
      <SpreadSelection
        spreadFilter={spreadFilter}
        onFilterChange={setSpreadFilter}
        onSelectSpread={setSelectedSpread}
        onSwitchToOracle={() => setDeckType("oracle")}
      />
    );
  }

  // Method Selection
  if (!mode || (!showResults && drawnCards.length === 0 && !isDrawing)) {
    return (
      <MethodSelection
        spread={currentSpread}
        isDrawing={isDrawing}
        onBack={resetReading}
        onRandomDraw={() => {
          setMode("random");
          drawRandom();
        }}
        onManualPick={() => setMode("manual")}
        moonPhaseName={moonPhaseName}
      />
    );
  }

  // Results Screen
  return (
    <ReadingResults
      drawnCards={drawnCards}
      spread={currentSpread}
      saveError={saveError}
      savedId={savedId}
      saving={saving}
      ambientEnabled={ambientEnabled}
      onSaveReading={saveReading}
      onToggleAmbient={toggleAmbient}
      onReset={resetReading}
      onNewReading={() => {
        setDrawnCards([]);
        setShowResults(false);
        setMode(null);
      }}
      moonPhaseName={moonPhaseName}
    />
  );
}
