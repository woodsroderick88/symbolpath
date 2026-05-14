import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Heart,
  MessageCircle,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react-native";

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [customSpreads, setCustomSpreads] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, [activeTab]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      if (activeTab === "feed") {
        const response = await fetch("/api/community/posts");
        const data = await response.json();
        setPosts(data);
      } else if (activeTab === "spreads") {
        const response = await fetch("/api/community/spreads");
        const data = await response.json();
        setCustomSpreads(data);
      } else if (activeTab === "discussions") {
        const response = await fetch("/api/community/discussions");
        const data = await response.json();
        setDiscussions(data);
      }
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setLoading(false);
    }
  };

  const upvotePost = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upvote: true }),
      });
      loadCommunityData();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const upvoteSpread = async (spreadId) => {
    try {
      await fetch(`/api/community/spreads/${spreadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upvote: true }),
      });
      loadCommunityData();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0a0a0f", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <View
        style={{ padding: 20, borderBottomWidth: 1, borderColor: "#1a1a2e" }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#fff",
            marginBottom: 16,
          }}
        >
          Community
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("feed")}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: activeTab === "feed" ? "#4a1d96" : "#1a1a2e",
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}
            >
              Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("spreads")}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: activeTab === "spreads" ? "#4a1d96" : "#1a1a2e",
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}
            >
              Spreads
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("discussions")}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor:
                activeTab === "discussions" ? "#4a1d96" : "#1a1a2e",
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}
            >
              Discuss
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadCommunityData}
            tintColor="#a78bfa"
          />
        }
      >
        {activeTab === "feed" && (
          <View style={{ gap: 16 }}>
            {posts.map((post) => (
              <View
                key={post.id}
                style={{
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              >
                <Text
                  style={{ color: "#a78bfa", fontSize: 12, marginBottom: 4 }}
                >
                  {new Date(post.created_at).toLocaleDateString()}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  {post.spread_name}
                </Text>
                {post.interpretation && (
                  <Text
                    style={{
                      color: "#d1d5db",
                      fontSize: 14,
                      marginBottom: 12,
                      lineHeight: 20,
                    }}
                  >
                    {post.interpretation.substring(0, 150)}...
                  </Text>
                )}
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <TouchableOpacity
                    onPress={() => upvotePost(post.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Heart size={20} color="#a78bfa" />
                    <Text style={{ color: "#a78bfa", fontSize: 14 }}>
                      {post.upvotes}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MessageCircle size={20} color="#6b7280" />
                    <Text style={{ color: "#6b7280", fontSize: 14 }}>0</Text>
                  </View>
                </View>
              </View>
            ))}

            {posts.length === 0 && !loading && (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Users size={48} color="#4b5563" />
                <Text style={{ color: "#6b7280", fontSize: 16, marginTop: 12 }}>
                  No posts yet. Be the first to share!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "spreads" && (
          <View style={{ gap: 16 }}>
            {customSpreads.map((spread) => (
              <View
                key={spread.id}
                style={{
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  {spread.name}
                </Text>
                <Text
                  style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}
                >
                  by {spread.created_by}
                </Text>
                {spread.description && (
                  <Text
                    style={{ color: "#d1d5db", fontSize: 14, marginBottom: 12 }}
                  >
                    {spread.description}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => upvoteSpread(spread.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <TrendingUp size={20} color="#a78bfa" />
                    <Text style={{ color: "#a78bfa", fontSize: 14 }}>
                      {spread.upvotes}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    {spread.positions?.length || 0} positions
                  </Text>
                </View>
              </View>
            ))}

            {customSpreads.length === 0 && !loading && (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Plus size={48} color="#4b5563" />
                <Text style={{ color: "#6b7280", fontSize: 16, marginTop: 12 }}>
                  No custom spreads yet
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "discussions" && (
          <View style={{ gap: 16 }}>
            {discussions.map((discussion) => (
              <View
                key={discussion.id}
                style={{
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  {discussion.topic}
                </Text>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    marginBottom: 12,
                    lineHeight: 20,
                  }}
                >
                  {discussion.content}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={{ color: "#a78bfa", fontSize: 12 }}>
                    {discussion.replies?.length || 0} replies
                  </Text>
                </View>
              </View>
            ))}

            {discussions.length === 0 && !loading && (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <MessageCircle size={48} color="#4b5563" />
                <Text style={{ color: "#6b7280", fontSize: 16, marginTop: 12 }}>
                  Start a discussion
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
