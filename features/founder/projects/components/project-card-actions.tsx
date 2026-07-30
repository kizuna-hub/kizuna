"use client";

import React from "react";
import {
  Copy,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const menuClassName =
  "min-w-48 rounded-lg border-workspace-border bg-workspace-elevated p-1.5 text-ink shadow-framer-edge";
const menuItemClassName =
  "min-h-9 cursor-pointer rounded-md workspace-control-text text-workspace-muted-text focus:bg-workspace-row-hover focus:text-ink";
const triggerClassName =
  "size-8 rounded-lg text-workspace-muted-text shadow-none hover:bg-workspace-row-hover hover:text-ink data-[state=open]:bg-workspace-selected data-[state=open]:text-primary";

export function ProjectCardActions({
  projectName,
  projectPath,
  onDuplicate,
  onRename,
  onDelete,
}: {
  projectName: string;
  projectPath: string;
  onDuplicate: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const locale = useLocale();
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [renameValue, setRenameValue] =
    React.useState(projectName);
  const [announcement, setAnnouncement] =
    React.useState("");

  React.useEffect(() => {
    if (!renameOpen) setRenameValue(projectName);
  }, [projectName, renameOpen]);

  const copyProjectLink = async () => {
    const localizedPath = `/${locale}${projectPath}`;
    const projectUrl = new URL(
      localizedPath,
      window.location.origin,
    ).toString();
    try {
      await navigator.clipboard.writeText(projectUrl);
      setAnnouncement("Project link copied.");
    } catch {
      setAnnouncement(
        "The link could not be copied automatically.",
      );
    }
  };

  const submitRename = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const nextName = renameValue.trim();
    if (!nextName) return;
    onRename(nextName);
    setRenameOpen(false);
    setAnnouncement("Project renamed.");
  };

  return (
    <>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={triggerClassName}
            aria-label={`Copy options for ${projectName}`}
          >
            <Link2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className={menuClassName}
        >
          <DropdownMenuItem
            className={menuItemClassName}
            onSelect={() => {
              onDuplicate();
              setAnnouncement("Project copied.");
            }}
          >
            <Copy className="size-4" />
            Copy project
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemClassName}
            onSelect={() => void copyProjectLink()}
          >
            <Link2 className="size-4" />
            Copy project link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={triggerClassName}
            aria-label={`More options for ${projectName}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className={menuClassName}
        >
          <DropdownMenuItem
            className={menuItemClassName}
            onSelect={() => {
              setRenameValue(projectName);
              setRenameOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className={menuItemClassName}
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Xóa dự án
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="border-workspace-border bg-workspace-elevated text-ink shadow-framer-edge sm:max-w-md">
          <form onSubmit={submitRename}>
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription className="text-workspace-muted-text">
                The new name will be used across Projects and the
                workspace.
              </DialogDescription>
            </DialogHeader>
            <label className="mt-5 block">
              <span className="workspace-supporting font-medium text-ink">
                Project name
              </span>
              <Input
                autoFocus
                value={renameValue}
                maxLength={80}
                onChange={(event) =>
                  setRenameValue(event.target.value)
                }
                className="mt-2 h-11 border-workspace-border bg-workspace-panel"
              />
            </label>
            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!renameValue.trim()}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent className="gap-3 rounded-xl border-workspace-border bg-workspace-elevated p-4 text-ink shadow-framer-edge sm:max-w-sm">
          <AlertDialogHeader className="gap-1.5">
            <AlertDialogTitle className="text-base">
              Xóa “{projectName}”?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-5 text-workspace-muted-text">
              Dự án này và dữ liệu demo liên quan sẽ bị xóa khỏi
              workspace. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-1">
            <AlertDialogCancel className="h-9 px-4 text-xs">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="h-9 px-4 text-xs"
            >
              Xóa dự án
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
