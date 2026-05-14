import { useState, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  X,
  Images,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { tarotCards } from "@/data/tarot-cards";
import { tarotImages } from "@/data/tarot-images";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const FILTERS = [
  { id: "all", label: "All" },
  { id: "major", label: "Major Arcana" },
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

// ─── Card List Item ───────────────────────────────────────────────────────────
function TarotCard({ card, onPress, onGalleryPress }) {
  const imageUrl = tarotImages[card.id];
  return (
    <TouchableOpacity
      onPress={() => onPress(card)}
      activeOpacity={0.7}
      style={styles.listCard}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.listCardImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.listCardBody}>
        <Text style={styles.listCardName}>{card.name}</Text>
        <Text style={styles.listCardSub}>
          {card.arcana === "major"
            ? `Major Arcana • No. ${card.number}`
            : `${card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : ""} • No. ${card.number}`}
        </Text>
        <View style={styles.keywordRow}>
          {card.upright.keywords.slice(0, 3).map((kw, i) => (
            <View key={i} style={styles.keywordPill}>
              <Text style={styles.keywordText}>{kw}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Card Detail Modal ────────────────────────────────────────────────────────
function CardDetailModal({ card, visible, onClose }) {
  const insets = useSafeAreaInsets();
  if (!card) return null;
  const imageUrl = tarotImages[card.id];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{card.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailImageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.detailImage}
              contentFit="cover"
              transition={300}
            />
            <Text style={styles.detailArcana}>
              {card.arcana === "major"
                ? "Major Arcana"
                : `${card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : ""} — Minor Arcana`}
            </Text>
          </View>

          <View style={styles.meaningBox}>
            <Text style={styles.meaningTitle}>Upright</Text>
            <View style={styles.keywordRow}>
              {card.upright.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordPillIndigo}>
                  <Text style={styles.keywordTextIndigo}>{kw}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.meaningText}>{card.upright.meaning}</Text>
          </View>

          <View style={styles.meaningBox}>
            <Text style={styles.meaningTitle}>Reversed</Text>
            <View style={styles.keywordRow}>
              {card.reversed.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordPill}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.meaningText}>{card.reversed.meaning}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Gallery Modal ────────────────────────────────────────────────────────────
function GalleryModal({ cards, startIndex, visible, onClose }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showDetail, setShowDetail] = useState(false);
  const carouselRef = useRef(null);

  const currentCard = cards[currentIndex];

  const handleSnapToItem = useCallback((index) => {
    setCurrentIndex(index);
    setShowDetail(false);
  }, []);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.galleryContainer, { paddingTop: insets.top }]}>
        <StatusBar style="light" />

        {/* Header */}
        <View style={styles.galleryHeader}>
          <TouchableOpacity onPress={onClose} style={styles.galleryClose}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.galleryCounter}>
            {currentIndex + 1} / {cards.length}
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Card Name */}
        <Text style={styles.galleryCardName}>{currentCard?.name}</Text>
        <Text style={styles.galleryCardSub}>
          {currentCard?.arcana === "major"
            ? `Major Arcana • ${currentCard.number}`
            : `${currentCard?.suit ? currentCard.suit.charAt(0).toUpperCase() + currentCard.suit.slice(1) : ""} • ${currentCard?.number}`}
        </Text>

        {/* Carousel */}
        <Carousel
          ref={carouselRef}
          data={cards}
          defaultIndex={startIndex}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT * 0.5}
          onSnapToItem={handleSnapToItem}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.88,
            parallaxScrollingOffset: 48,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setShowDetail((v) => !v)}
              style={styles.galleryCardWrapper}
            >
              <Image
                source={{ uri: tarotImages[item.id] }}
                style={styles.galleryCardImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
        />

        {/* Swipe hint */}
        <View style={styles.arrowRow}>
          <ChevronLeft size={20} color="#ffffff66" />
          <Text style={styles.swipeHint}>
            Swipe to browse • Tap card for meaning
          </Text>
          <ChevronRight size={20} color="#ffffff66" />
        </View>

        {/* Expandable meaning panel */}
        {showDetail && currentCard && (
          <ScrollView
            style={styles.galleryDetail}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: insets.bottom + 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.galleryDetailTitle}>Upright</Text>
            <View style={[styles.keywordRow, { marginBottom: 6 }]}>
              {currentCard.upright.keywords.map((kw, i) => (
                <View key={i} style={styles.galleryKeyPill}>
                  <Text style={styles.galleryKeyText}>{kw}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.galleryMeaning}>
              {currentCard.upright.meaning}
            </Text>

            <Text style={[styles.galleryDetailTitle, { marginTop: 14 }]}>
              Reversed
            </Text>
            <View style={[styles.keywordRow, { marginBottom: 6 }]}>
              {currentCard.reversed.keywords.map((kw, i) => (
                <View key={i} style={styles.galleryKeyPill}>
                  <Text style={styles.galleryKeyText}>{kw}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.galleryMeaning}>
              {currentCard.reversed.meaning}
            </Text>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCard, setSelectedCard] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const filteredCards = useMemo(() => {
    return tarotCards.filter((card) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "major" && card.arcana === "major") ||
        card.suit === activeFilter;
      const matchesSearch =
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.upright.keywords.some((k) =>
          k.toLowerCase().includes(search.toLowerCase()),
        );
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  const openGallery = (card) => {
    const idx = filteredCards.findIndex((c) => c.id === card.id);
    setGalleryStartIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Tarot Library</Text>
            <Text style={styles.headerSub}>
              Explore the wisdom of the cards
            </Text>
          </View>
          <TouchableOpacity
            style={styles.galleryBtn}
            onPress={() => {
              setGalleryStartIndex(0);
              setGalleryOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Images size={18} color="#4F46E5" />
            <Text style={styles.galleryBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search cards or keywords..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearBtn}
            >
              <X size={14} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setActiveFilter(f.id)}
              style={[
                styles.filterChip,
                activeFilter === f.id && styles.filterChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.id && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Card list */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>{filteredCards.length} cards</Text>
        {filteredCards.map((card) => (
          <TarotCard
            key={card.id}
            card={card}
            onPress={setSelectedCard}
            onGalleryPress={openGallery}
          />
        ))}
      </ScrollView>

      <CardDetailModal
        card={selectedCard}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      <GalleryModal
        cards={filteredCards}
        startIndex={galleryStartIndex}
        visible={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },
  headerSub: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  galleryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4F46E5",
    borderRadius: 20,
    marginTop: 4,
  },
  galleryBtnText: { color: "#4F46E5", fontWeight: "600", fontSize: 13 },

  // Search
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111827", paddingVertical: 11 },
  clearBtn: { padding: 4 },

  // Filters
  filterRow: { paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  filterChipActive: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  filterChipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  filterChipTextActive: { color: "#fff" },

  // List card
  listCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listCardImage: { width: 54, height: 84, borderRadius: 8, marginRight: 14 },
  listCardBody: { flex: 1 },
  listCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  listCardSub: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  keywordRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  keywordPill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  keywordText: { fontSize: 11, color: "#4B5563" },
  keywordPillIndigo: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  keywordTextIndigo: { fontSize: 11, color: "#4338CA" },

  // Count
  countText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 8,
  },

  // Detail modal
  modalContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  closeBtn: { padding: 6 },
  detailImageWrapper: { alignItems: "center", marginBottom: 20 },
  detailImage: { width: 200, height: 340, borderRadius: 14 },
  detailArcana: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 10,
    letterSpacing: 1,
  },
  meaningBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  meaningText: { fontSize: 14, color: "#374151", lineHeight: 22, marginTop: 8 },

  // Gallery modal
  galleryContainer: { flex: 1, backgroundColor: "#0F0A1E" },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  galleryClose: { padding: 8 },
  galleryCounter: { fontSize: 14, color: "#ffffff99", fontWeight: "500" },
  galleryCardName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  galleryCardSub: {
    fontSize: 12,
    color: "#9B7FD4",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 12,
  },
  galleryCardWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryCardImage: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_HEIGHT * 0.48,
    borderRadius: 16,
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  swipeHint: { fontSize: 12, color: "#ffffff55" },
  galleryDetail: {
    flex: 1,
    backgroundColor: "#1C1332",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 6,
  },
  galleryDetailTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C4B5FD",
    marginBottom: 6,
  },
  galleryKeyPill: {
    backgroundColor: "#2D1F5E",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  galleryKeyText: { fontSize: 11, color: "#A78BFA" },
  galleryMeaning: { fontSize: 13, color: "#D1D5DB", lineHeight: 20 },
});
