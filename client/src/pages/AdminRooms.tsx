import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { motion } from "motion/react";
import {
  BedDouble,
  Camera,
  Edit3,
  ImageIcon,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";
import {
  useNavigate,
} from "react-router";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

import type {
  AdminRoom,
  AdminRoomResponse,
  AdminRoomsResponse,
  UploadRoomImageResponse,
} from "../types/room";

type RoomForm = {
  name: string;
  description: string;
  price: string;
  capacity: string;
  imageUrl: string;
};

const emptyForm: RoomForm = {
  name: "",
  description: "",
  price: "",
  capacity: "",
  imageUrl: "",
};

function formatPrice(
  value: string | number,
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}

export default function AdminRooms() {
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const [
    rooms,
    setRooms,
  ] = useState<AdminRoom[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingRoom,
    setEditingRoom,
  ] = useState<AdminRoom | null>(
    null,
  );

  async function fetchRooms() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.get<AdminRoomsResponse>(
          "/api/admin/rooms",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setRooms(
        response.data.rooms,
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Failed to load admin rooms:",
        error,
      );

      if (
        axios.isAxiosError(
          error,
        )
      ) {
        if (
          error.response
            ?.status === 401
        ) {
          logout();

          navigate(
            "/login",
            {
              replace: true,
              state: {
                from:
                  "/admin/rooms",
              },
            },
          );

          return;
        }

        if (
          error.response
            ?.status === 403
        ) {
          navigate(
            "/account",
            {
              replace: true,
            },
          );

          return;
        }
      }

      setError(
        "We couldn't load the rooms.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return rooms;
      }

      return rooms.filter(
        (room) =>
          room.name
            .toLowerCase()
            .includes(query) ||
          room.description
            .toLowerCase()
            .includes(query),
      );
    }, [
      rooms,
      search,
    ]);

  function openCreateModal() {
    setEditingRoom(null);
    setModalOpen(true);
  }

  function openEditModal(
    room: AdminRoom,
  ) {
    setEditingRoom(room);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRoom(null);
  }

  function handleRoomSaved(
    room: AdminRoom,
  ) {
    setRooms(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item.id ===
              room.id,
          );

        if (exists) {
          return current.map(
            (item) =>
              item.id ===
              room.id
                ? room
                : item,
          );
        }

        return [
          ...current,
          room,
        ];
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#11120f]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {/* HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              Property
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f5f1e8] sm:text-3xl">
              Rooms
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Manage Haven's room
              inventory and pricing.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                fetchRooms
              }
              disabled={
                loading
              }
              className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="flex min-h-10 items-center gap-2 rounded-full bg-[#c9b58d] px-4 text-xs font-medium text-[#171714]"
            >
              <Plus
                size={14}
              />

              Add room
            </button>
          </div>
        </header>

        <div className="my-7 h-px bg-white/[0.07]" />

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search rooms"
            className="h-11 w-full rounded-full border border-white/[0.08] bg-[#171814] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/15"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            {
              filteredRooms.length
            }{" "}
            {filteredRooms.length ===
            1
              ? "room"
              : "rooms"}
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
            Inventory management
          </p>
        </div>

        {loading ? (
          <RoomsLoading />
        ) : error ? (
          <RoomsError
            message={error}
            onRetry={
              fetchRooms
            }
          />
        ) : filteredRooms.length ===
          0 ? (
          <EmptyRooms />
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map(
              (room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={() =>
                    openEditModal(
                      room,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <RoomModal
          room={
            editingRoom
          }
          onClose={
            closeModal
          }
          onSaved={
            handleRoomSaved
          }
        />
      )}
    </div>
  );
}

function RoomCard({
  room,
  onEdit,
}: {
  room: AdminRoom;
  onEdit: () => void;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#171814]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
        {room.imageUrl ? (
          <img
            src={
              room.imageUrl
            }
            alt={
              room.name
            }
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon
              size={24}
              className="text-white/20"
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
            Room #
            {room.id}
          </p>

          <h2 className="mt-1 text-lg font-medium tracking-[-0.03em]">
            {room.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={
            onEdit
          }
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
          aria-label={`Edit ${room.name}`}
        >
          <Edit3
            size={15}
          />
        </button>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 min-h-[40px] text-xs leading-5 text-white/35">
          {
            room.description
          }
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4">
          <RoomStat
            label="Price"
            value={formatPrice(
              room.price,
            )}
          />

          <RoomStat
            label="Capacity"
            value={`${room.capacity}`}
          />

          <RoomStat
            label="Bookings"
            value={`${room.bookingCount}`}
          />
        </div>
      </div>
    </motion.article>
  );
}

function RoomStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.16em] text-white/20">
        {label}
      </p>

      <p className="mt-2 truncate text-xs font-medium text-white/65">
        {value}
      </p>
    </div>
  );
}

function RoomModal({
  room,
  onClose,
  onSaved,
}: {
  room: AdminRoom | null;
  onClose: () => void;
  onSaved: (
    room: AdminRoom,
  ) => void;
}) {
  const isEditing =
    Boolean(room);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    form,
    setForm,
  ] = useState<RoomForm>(
    room
      ? {
          name:
            room.name,
          description:
            room.description,
          price:
            room.price,
          capacity:
            String(
              room.capacity,
            ),
          imageUrl:
            room.imageUrl ||
            "",
        }
      : emptyForm,
  );

  const [
    imageFile,
    setImageFile,
  ] = useState<File | null>(
    null,
  );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState(
    room?.imageUrl ||
      "",
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const formComplete =
    form.name.trim() !== "" &&
    form.description.trim() !== "" &&
    Number(form.price) > 0 &&
    Number(form.capacity) > 0 &&
    (
      form.imageUrl !== "" ||
      imageFile !== null
    );

  function updateField(
    field: keyof RoomForm,
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    if (error) {
      setError("");
    }
  }

  function handleImageSelected(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      return;
    }

    setImageFile(
      file,
    );

    const localPreview =
      URL.createObjectURL(
        file,
      );

    setPreviewUrl(
      localPreview,
    );

    setError("");
  }

  async function uploadImage() {
    if (!imageFile) {
      return form.imageUrl;
    }

    try {
      setUploading(true);

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile,
      );

      const response =
        await api.post<UploadRoomImageResponse>(
          "/api/admin/rooms/upload-image",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      return response.data
        .imageUrl;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !formComplete ||
      saving ||
      uploading
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const imageUrl =
        await uploadImage();

      if (!imageUrl) {
        setError(
          "Please select a room image.",
        );

        return;
      }

      const payload = {
        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(
            form.price,
          ),

        capacity:
          Number(
            form.capacity,
          ),

        imageUrl,
      };

      let response;

      if (
        room
      ) {
        response =
          await api.patch<AdminRoomResponse>(
            `/api/admin/rooms/${room.id}`,
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );
      } else {
        response =
          await api.post<AdminRoomResponse>(
            "/api/admin/rooms",
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );
      }

      onSaved(
        response.data.room,
      );

      onClose();
    } catch (
      error: unknown
    ) {
      console.error(
        "Save room failed:",
        error,
      );

      if (
        axios.isAxiosError(
          error,
        )
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to save room.",
        );
      } else {
        setError(
          "Unable to save room.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md sm:py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#171814] text-[#f5f1e8] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-7">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              {isEditing
                ? "Edit room"
                : "New room"}
            </p>

            <h2 className="mt-1 text-xl font-medium tracking-[-0.04em]">
              {isEditing
                ? room?.name
                : "Add a room"}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X
              size={16}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="p-5 sm:p-7"
        >
          {/* IMAGE */}
          <div>
            <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Room image
            </label>

            <div className="mt-3 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#11120f]">
              <div className="relative aspect-[16/8] overflow-hidden">
                {previewUrl ? (
                  <img
                    src={
                      previewUrl
                    }
                    alt="Room preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Camera
                      size={24}
                      className="text-white/20"
                    />

                    <p className="mt-3 text-xs text-white/25">
                      Select a room image
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/20">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-md"
                  >
                    <Upload
                      size={14}
                    />

                    {previewUrl
                      ? "Change image"
                      : "Choose image"}
                  </button>
                </div>
              </div>
            </div>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleImageSelected
              }
              className="hidden"
            />

            {imageFile && (
              <p className="mt-2 text-[10px] text-white/25">
                Selected:{" "}
                {
                  imageFile.name
                }
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Room name
              </span>

              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "name",
                    event.target
                      .value,
                  )
                }
                placeholder="Executive Suite"
                className="mt-2 h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />
            </label>

            <label>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Price per night
              </span>

              <input
                type="number"
                min="1"
                value={
                  form.price
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "price",
                    event.target
                      .value,
                  )
                }
                placeholder="145000"
                className="mt-2 h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />
            </label>

            <label>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Guest capacity
              </span>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  form.capacity
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "capacity",
                    event.target
                      .value,
                  )
                }
                placeholder="2"
                className="mt-2 h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Description
              </span>

              <textarea
                value={
                  form.description
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "description",
                    event.target
                      .value,
                  )
                }
                rows={5}
                placeholder="Describe the room, atmosphere, amenities and experience..."
                className="mt-2 w-full resize-none rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />
            </label>
          </div>

          {error && (
            <div className="mt-5 rounded-[14px] border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              className="min-h-11 rounded-full border border-white/10 px-5 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !formComplete ||
                saving ||
                uploading
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#c9b58d] px-5 text-xs font-medium text-[#171714] transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ||
              uploading ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <BedDouble
                  size={14}
                />
              )}

              {uploading
                ? "Uploading image..."
                : saving
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Add room"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function RoomsLoading() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-[360px] animate-pulse rounded-[22px] bg-white/[0.04]"
          />
        ),
      )}
    </div>
  );
}

function RoomsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <p className="text-lg font-medium">
          Rooms unavailable
        </p>

        <p className="mt-2 text-sm text-white/30">
          {message}
        </p>

        <button
          type="button"
          onClick={
            onRetry
          }
          className="mt-6 rounded-full bg-[#f5f1e8] px-5 py-2.5 text-xs font-medium text-[#171714]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function EmptyRooms() {
  return (
    <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <BedDouble
          size={24}
          className="mx-auto text-[#c9b58d]"
        />

        <p className="mt-4 text-lg font-medium">
          No rooms found
        </p>

        <p className="mt-2 text-sm text-white/30">
          Add a room or change
          your search.
        </p>
      </div>
    </div>
  );
}