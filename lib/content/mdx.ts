import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { TopicFrontmatter } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Topic {
  slug: string;
  slugPath: string; // ej: "swing/jframe"
  frontmatter: TopicFrontmatter;
  content: string;
}

export function getTopicsByMateria(materia: string): Topic[] {
  const dir = path.join(CONTENT_DIR, materia);
  if (!fs.existsSync(dir)) return [];

  const topics: Topic[] = [];
  walkDir(dir, materia, topics);

  return topics.sort((a, b) => {
    // Ordenar por seccion + orden
    const secA = a.frontmatter.seccion + String(a.frontmatter.orden).padStart(3, "0");
    const secB = b.frontmatter.seccion + String(b.frontmatter.orden).padStart(3, "0");
    return secA.localeCompare(secB);
  });
}

function walkDir(dir: string, materia: string, acc: Topic[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, materia, acc);
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      const slugPath = fullPath
        .replace(path.join(CONTENT_DIR, materia) + "/", "")
        .replace(/\.(mdx|md)$/, "");
      acc.push({
        slug: slugPath.split("/").pop()!,
        slugPath,
        frontmatter: data as TopicFrontmatter,
        content,
      });
    }
  }
}

export function getTopic(materia: string, slugPath: string): Topic | null {
  const exts = [".mdx", ".md"];
  for (const ext of exts) {
    const filePath = path.join(CONTENT_DIR, materia, slugPath + ext);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: slugPath.split("/").pop()!,
        slugPath,
        frontmatter: data as TopicFrontmatter,
        content,
      };
    }
  }
  return null;
}
