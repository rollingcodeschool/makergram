import { useEffect, useState } from "react";
import { getTimeAgo } from "../utils/time";
// import { posts as initialPosts, type Post } from "../mocks/posts";
import { HeartIcon } from "../components/HeartIcon";
import { AppHeader } from "../components/AppHeader";
import { supabase } from "../lib/client";

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/7163703/pexels-photo-7163703.jpeg";

interface Post_rank {
  id: number | string;
  user_id: string;
  image_url: string;
  caption: string;
  likes: number;
  isLiked?: boolean;
  created_at: Date;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

function Modal({ post, onClose }: { post: Post_rank; onClose: () => void }) {
  const username = post.profile?.username || "default_user";
  const avatarUrl = post.profile?.avatar_url || DEFAULT_AVATAR;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card-bg rounded-xl overflow-hidden max-w-lg w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header con usuario */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary bg-card-bg">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg text-foreground/40">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">@{username}</span>
            <span className="text-xs text-foreground/50">
              {getTimeAgo(new Date(post.created_at))}
            </span>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative w-full aspect-square">
          <img
            src={post.image_url}
            alt={`Post de ${username}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Likes y caption */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <HeartIcon size="sm" />
            <span className="text-lg font-bold text-foreground">
              {post.likes.toLocaleString()} likes
            </span>
          </div>
          <p className="mt-2 text-foreground">
            <span className="font-semibold">@{username}</span>{" "}
            <span className="text-foreground/80">{post.caption}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Rank() {
  const [selectedPost, setSelectedPost] = useState<Post_rank | null>(null);
  const [posts, setPosts] = useState<Post_rank[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      //  1. Obtener posts
      const { data: postsData, error } = await supabase
        .from("posts_new")
        .select("id, image_url, caption, likes, user_id, created_at")
        .gt("likes", 5)
        .order("likes", { ascending: false });

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ranking" containerClassName="max-w-2xl mx-auto" />

      {/* Grid de posts */}
      <main className="max-w-2xl mx-auto p-2">
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={post.image_url}
                alt={`Post con ${post.likes} likes`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay con likes al hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 cursor-pointer">
                <HeartIcon size="sm" />
                <span className="text-white font-semibold">
                  {post.likes.toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedPost && (
        <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
