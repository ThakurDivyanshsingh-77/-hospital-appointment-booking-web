import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, X, AlertTriangle, RotateCcw, FileImage, CheckCircle2 } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  failed?: boolean;
}

export const getReadableFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUploadRoot = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("space-y-4 w-full min-w-0 overflow-hidden", className)}>{children}</div>;
};

interface DropZoneProps {
  isDisabled?: boolean;
  onDropFiles: (files: FileList) => void;
  className?: string;
}

const FileUploadDropZone = ({ isDisabled, onDropFiles, className }: DropZoneProps) => {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (isDisabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isDisabled) return;

    if (e.target.files && e.target.files.length > 0) {
      onDropFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 select-none",
        isDragActive
          ? "border-blue-600 bg-blue-50/50 scale-[0.99]"
          : "border-slate-200 bg-slate-50/30 hover:border-blue-400 hover:bg-slate-50/70",
        isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={isDisabled}
        accept=".pdf,.jpg,.jpeg,.png,.webp"
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors">
        <Upload className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-sm font-semibold text-slate-800">
        Drag & drop files here, or <span className="text-blue-600 hover:text-blue-700">browse</span>
      </p>
      <p className="text-xs text-slate-500 mt-1">PDF, JPEG, PNG, WebP (max 10MB)</p>
    </div>
  );
};

const FileUploadList = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("space-y-2.5 mt-3 max-h-60 overflow-y-auto pr-2 w-full min-w-0", className)}>{children}</div>;
};

interface ListItemProgressBarProps {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  failed?: boolean;
  onDelete: () => void;
  onRetry: () => void;
  onView?: () => void;
}

const FileUploadListItemProgressBar = ({
  name,
  type,
  size,
  progress,
  failed,
  onDelete,
  onRetry,
  onView,
}: ListItemProgressBarProps) => {
  const isImage = type.includes("image") || ["jpg", "jpeg", "png", "webp"].some(ext => name.toLowerCase().endsWith(ext));
  
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 w-full overflow-hidden">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          failed ? "bg-rose-50 text-rose-500" : isImage ? "bg-blue-50 text-blue-500" : "bg-blue-50 text-blue-500"
        )}>
          {failed ? (
            <AlertTriangle className="h-5 w-5" />
          ) : isImage ? (
            <FileImage className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="truncate text-xs font-semibold text-slate-800">{name}</p>
            {progress < 100 && !failed && (
              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                {progress}%
              </span>
            )}
            {progress === 100 && !failed && (
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Uploaded
              </span>
            )}
            {failed && (
              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Failed
              </span>
            )}
          </div>

          {/* Progress Bar (Only show if less than 100% and not failed) */}
          {progress < 100 && !failed && (
            <div className="relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {failed && (
            <p className="text-[10px] text-rose-500 font-semibold leading-none">Upload failed. Click retry to try again.</p>
          )}

          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-400">
            <span>{getReadableFileSize(size)}</span>
            {progress === 100 && !failed && (
              <span className="flex items-center gap-0.5 text-blue-600">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onView && progress === 100 && !failed && (
          <button
            type="button"
            onClick={onView}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            title="View File"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
        {failed && (
          <button
            type="button"
            onClick={onRetry}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            title="Retry Upload"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          title="Delete"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const FileUpload = {
  Root: FileUploadRoot,
  DropZone: FileUploadDropZone,
  List: FileUploadList,
  ListItemProgressBar: FileUploadListItemProgressBar,
};
