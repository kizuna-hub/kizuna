import type {
  StartupDocumentExtension,
  StartupDocumentInput,
  StartupDocumentOutcome,
  StartupDocumentRole,
} from "../types/venture-analysis.types";

export const SUPPORTED_STARTUP_DOCUMENT_EXTENSIONS = [
  "pdf",
  "pptx",
  "docx",
] as const;

export interface StartupFileLike {
  name: string;
  size: number;
  type: string;
}

export type DocumentValidationResult =
  | {
      ok: true;
      document: StartupDocumentInput;
    }
  | {
      ok: false;
      message: string;
    };

function getExtension(name: string) {
  return name.split(".").at(-1)?.toLowerCase() ?? "";
}

function documentId(
  role: StartupDocumentRole,
  file: StartupFileLike,
) {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `startup-document-${role}-${safeName}-${file.size}`;
}

export function validateStartupDocument(
  file: StartupFileLike,
  role: StartupDocumentRole,
  selectedDocuments: StartupDocumentInput[],
): DocumentValidationResult {
  const extension = getExtension(file.name);
  if (
    !SUPPORTED_STARTUP_DOCUMENT_EXTENSIONS.includes(
      extension as StartupDocumentExtension,
    )
  ) {
    return {
      ok: false,
      message:
        "Định dạng tài liệu chưa được hỗ trợ. Hãy sử dụng PDF, PPTX hoặc DOCX.",
    };
  }

  const duplicate = selectedDocuments.some(
    (document) =>
      document.role !== role &&
      document.name.toLocaleLowerCase("vi") ===
        file.name.toLocaleLowerCase("vi") &&
      document.size === file.size,
  );
  if (duplicate) {
    return {
      ok: false,
      message:
        "Tài liệu này đã được chọn. Hãy chọn một file khác cho vai trò còn lại.",
    };
  }

  return {
    ok: true,
    document: {
      id: documentId(role, file),
      role,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      extension: extension as StartupDocumentExtension,
    },
  };
}

export function getMockDocumentOutcomes(
  documents: StartupDocumentInput[],
): StartupDocumentOutcome[] {
  return documents.map((document) => {
    const normalized = document.name.toLocaleLowerCase("vi");
    const fails =
      normalized.includes("corrupt") ||
      normalized.includes("unreadable") ||
      normalized.includes("khong-doc-duoc") ||
      normalized.includes("không-đọc-được");
    return fails
      ? {
          document,
          status: "failed",
          errorMessage: `${document.name} chưa đọc được.`,
        }
      : { document, status: "ready" };
  });
}

export function needsStageConfirmation(
  documents: StartupDocumentInput[],
) {
  return documents.some((document) => {
    const normalized = document.name.toLocaleLowerCase("vi");
    return (
      normalized.includes("unknown-stage") ||
      normalized.includes("khong-ro-giai-doan") ||
      normalized.includes("không-rõ-giai-đoạn")
    );
  });
}
