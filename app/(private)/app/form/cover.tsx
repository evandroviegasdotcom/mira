"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { defaultCover } from ".";

type CoverProps = {
  cover: string | File;
  setCover: (cover: string | File) => void;

  icon: string;
  setIcon: (icon: string) => void;
};
export default function Cover({ cover, setCover, icon, setIcon }: CoverProps) {
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(defaultCover);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      const url = e.target.result as string;
      setCoverPreviewUrl(url);
      setCover(file)
    };

    reader.readAsDataURL(file);
  };
  const onEmojiClick = (data: { imageUrl: string }) => {
    setShowEmojiPicker(false);
    const nIcon = data.imageUrl;
    setIcon(nIcon);
  };

  return (
    <div className="relative h-44 rounded group">
      <Image
        alt="Cover"
        fill
        src={coverPreviewUrl}
        className="object-cover rounded group-hover:brightness-75"
      />
      <div className="absolute inset-0 flex justify-end items-end p-5">
        <Button type="button" onClick={() => fileInputRef.current?.click()}>
          Upload Image
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {showEmojiPicker && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setShowEmojiPicker(false)}
          ></div>
          <div
            className="absolute z-20"
            style={{
              top: emojiRef.current
                ? emojiRef.current.offsetTop +
                  emojiRef.current.offsetHeight +
                  42
                : 0,
              left: emojiRef.current ? emojiRef.current.offsetLeft : 0,
            }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        </>
      )}
      <Image
        width={60}
        height={60}
        alt="Emoji"
        ref={emojiRef}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="absolute left-0 bottom-0 translate-y-1/2 cursor-pointer"
        src={icon}
      />
    </div>
  );
}
