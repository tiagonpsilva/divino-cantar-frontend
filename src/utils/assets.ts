// Utility para gerenciar caminhos de assets no GitHub Pages
export function getAssetPath(path: string): string {
  const basePath = import.meta.env.BASE_URL || '/';
  // Remove a primeira barra se existir para evitar dupla barra
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}${cleanPath}`;
}

// Função específica para logos
export function getLogoPath(isDarkMode: boolean): string {
  const logoFile = isDarkMode ? 'images/logo-dark.png' : 'images/logo-light.png';
  return getAssetPath(logoFile);
}