"use client";

import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

interface InputAreaProps {
    inputText: string;
    setInputText: (text: string) => void;
    selectedImage: string | undefined;
    setSelectedImage: (image: string | undefined) => void;
    fileName: string | null;
    setFileName: (name: string | null) => void;
    isAnalyzing: boolean;
    onAnalyze: () => void;
    isChat?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
    inputText,
    setInputText,
    selectedImage,
    setSelectedImage,
    fileName,
    setFileName,
    isAnalyzing,
    onAnalyze,
    isChat = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            if (file.type.startsWith('image/')) {
                setIsCompressing(true);
                try {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                        fileType: 'image/jpeg'
                    };

                    const compressedFile = await imageCompression(file, options);

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setSelectedImage(event.target?.result as string);
                        setIsCompressing(false);
                    };
                    reader.readAsDataURL(compressedFile);
                } catch (error) {
                    console.error("Compression failed:", error);
                    // Fallback to original
                    const reader = new FileReader();
                    reader.onload = (event) => setSelectedImage(event.target?.result as string);
                    reader.readAsDataURL(file);
                    setIsCompressing(false);
                }
            } else {
                setSelectedImage(undefined);
            }
        }
    };

    return (
        <div className={`w-full ${isChat ? 'max-w-4xl mx-auto' : 'chat-container-border'} rounded-2xl p-[1px] shadow-2xl overflow-hidden`}>
            <div className="bg-[#0f0f11] rounded-2xl flex flex-col h-full border border-white/5">
                <div className="p-3 md:p-5 pb-1 flex flex-col flex-grow">
                    {selectedImage ? (
                        <div className="mb-3 relative inline-flex self-start">
                            <img src={selectedImage} className="max-h-20 rounded-lg border border-white/10" alt="Preview" />
                            <button
                                onClick={() => setSelectedImage(undefined)}
                                className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:scale-110 transition-transform"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                            </button>
                        </div>
                    ) : isCompressing ? (
                        <div className="mb-3 flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 self-start">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-slate-400">Otimizando imagem...</span>
                        </div>
                    ) : null}

                    {fileName && !selectedImage && !isCompressing && (
                        <div className="mb-3 flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 self-start">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span className="text-[9px] text-white font-bold truncate max-w-[120px]">{fileName}</span>
                            <button onClick={() => setFileName(null)} className="text-slate-500 hover:text-white transition-colors"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg></button>
                        </div>
                    )}
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onAnalyze();
                            }
                        }}
                        placeholder={isChat ? "Enviar uma nova mensagem..." : "Cole o briefing ou envie um documento..."}
                        className="w-full bg-transparent border-none outline-none text-slate-100 min-h-[50px] md:min-h-[70px] resize-none placeholder:text-slate-700 text-sm md:text-base"
                    />
                </div>
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-500 hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <button
                        onClick={onAnalyze}
                        disabled={isAnalyzing || isCompressing || (!inputText && !selectedImage && !fileName)}
                        className="w-9 h-9 md:w-11 md:h-11 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        {isAnalyzing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        )}
                    </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf,text/plain" />
            </div>
        </div>
    );
};
