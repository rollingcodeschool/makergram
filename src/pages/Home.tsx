import { useEffect, useState } from "react";
import { PostCard } from "../components/PostCard";
import { AppHeader } from "../components/AppHeader";
import { type Post } from "../mocks/posts";
import { supabase } from "../lib/client";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

   useEffect(() => {
    const fetchPosts = async () => {
      const { data: postsData, error } = await supabase
        .from("posts_new")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener los posts:", error);
        return;
      } 
      // 2. Obtener IDs únicos de usuarios
      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      // 3. Buscar profiles de esos usuarios
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      // 4. Crear mapa de profiles por ID
      const profilesMap = new Map(
        profilesData?.map((p) => [
          p.id,
          { username: p.username, avatar_url: p.avatar_url },
        ]) || [],
      );

      // 5. Combinar posts con profiles
      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profile: profilesMap.get(post.user_id),
      }));

      setPosts(postsWithProfiles);
    };
    fetchPosts();
  }, []);


  const handleLike = (postId: number | string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Makergram" />

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </main>
    </div>
  );
}
