import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export function ordenarPorFechaMasReciente(a: Post, b: Post) {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function crearRutaPorId(post: Post) {
  return {
    params: { id: post.id },
    props: { post },
  };
}

export function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
