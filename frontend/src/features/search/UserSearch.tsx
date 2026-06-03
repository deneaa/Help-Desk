import { useState, useRef } from "react";
import { Search, User, ChevronRight, Shield, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserPublicDTO } from "../../types";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../redux/store";

interface UserSearchProps {
  fullPage?: boolean;
  placeholder?: string;
}

type Role = "admin" | "agent" | "user";

const roleConfig: Record<
  Role,
  { label: string; icon: React.ElementType; color: string }
> = {
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  agent: {
    label: "Agent",
    icon: Headphones,
    color: "text-violet-600 bg-violet-50 border-violet-200",
  },
  user: {
    label: "User",
    icon: User,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
};

export function UserSearch({
  fullPage = false,
  placeholder = "Search by name…",
}: UserSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserPublicDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/search/users?query=${encodeURIComponent(q)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (userId: number) => {
    navigate(`/users/${userId}`);
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  if (fullPage) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <SearchBox
          query={query}
          setQuery={(v) => {
            setQuery(v);
            setSearched(false);
          }}
          inputRef={inputRef}
          placeholder={placeholder}
          onSearch={handleSearch}
          large
        />
        {loading && (
          <p className="text-center text-gray-400 mt-8 text-sm">Searching…</p>
        )}
        {!loading && results.length > 0 && (
          <ResultsList results={results} onSelect={handleSelect}/>
        )}
        {!loading && searched && results.length === 0 && (
          <p className="text-center text-gray-400 mt-8 text-sm">
            No users found for "{query}"
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <SearchBox
        query={query}
        setQuery={(v) => {
          setQuery(v);
          setSearched(false);
        }}
        inputRef={inputRef}
        placeholder={placeholder}
        onSearch={handleSearch}
      />
      {results.length > 0 && (
        <div className="absolute z-20 top-full mt-10 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <ResultsList results={results} onSelect={handleSelect} compact />
        </div>
      )}
    </div>
  );
}

function SearchBox({
  query,
  setQuery,
  inputRef,
  placeholder,
  onSearch,
  large,
}: {
  query: string;
  setQuery: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  onSearch: () => void;
  large?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${large ? "mb-6" : ""}`}>
      <div className="relative flex-1">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${large ? "w-6 h-6" : "w-5 h-5"}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={placeholder}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all placeholder-gray-400 text-gray-800
            ${large ? "pl-14 pr-6 py-4 text-lg" : "pl-11 pr-4 py-2.5 text-sm"}`}
        />
      </div>
      <button
        onClick={onSearch}
        className={`shrink-0 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition-colors
          ${large ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm"}`}
      >
        Search
      </button>
    </div>
  );
}

function ResultsList({
  results,
  onSelect,
  compact,
}: {
  results: UserPublicDTO[];
  onSelect: (id: number) => void;
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "" : "space-y-2"}>
      {results.map((u) => {
        const role = u.role.toLowerCase() as Role;
        const {
          label,
          icon: RoleIcon,
          color,
        } = roleConfig[role] ?? roleConfig.user;
        return (
          <li key={u.id}>
            <button
              type="button"
              onMouseDown={() => onSelect(u.id)}
              className={`w-full flex items-center gap-4 text-left transition-all group
                ${
                  compact
                    ? "px-4 py-3 hover:bg-gray-50"
                    : "px-5 py-4 bg-white border border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-sm"
                }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-sm font-semibold">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate">
                  {u.name}
                </p>
              </div>

              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${color} shrink-0`}
              >
                <RoleIcon className="w-3 h-3" />
                {label}
              </span>

              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
