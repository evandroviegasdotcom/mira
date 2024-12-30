"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { useContextForm } from ".";

export default function Cover() {
  const { setCreative, creative } = useContextForm()
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState(creative.icon);
  const [coverUrl, setCoverUrl] = useState(creative.cover as string);
  const coverFile = useRef<File | null>(null)
  const emojiRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onEmojiClick = (data: { imageUrl: string }) => {
    setShow(false);
    const newIcon = data.imageUrl
    setIcon(newIcon);
    setCreative({ icon: newIcon, cover: coverFile.current ? coverFile.current : coverUrl });

  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const url = e.target.result as string
          setCoverUrl(url);
          coverFile.current = file
          setCreative({ icon, cover: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-44 rounded group">
      <Image
        alt="Cover"
        fill
        src={coverUrl}
        className="object-cover rounded group-hover:brightness-75"
      />
      <div className="absolute inset-0 flex justify-end items-end p-5">
        <Button
          onClick={handleButtonClick}
          className=" text-white"
          type="button"
        >
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

      {show && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={ () => setShow(false)}
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
        ref={emojiRef}
        className="absolute left-0 bottom-0 translate-y-1/2 cursor-pointer"
        alt="Emoji"
        src={icon}
        width={60}
        height={60}
        onClick={() => setShow(!show)}
      />
    </div>
  );
}
