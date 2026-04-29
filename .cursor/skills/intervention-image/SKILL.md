---
name: intervention-image
description: Usar Intervention Image v3 (intervention/image-laravel) para manipulação de imagens em uploads no Laravel. Ativa ao implementar ou alterar upload de imagens, redimensionamento, crop ou otimização de formato.
keywords:
  - intervention image
  - upload imagem
  - resize image
  - crop image
  - laravel image
---

# Intervention Image no projeto

O projeto usa **Intervention Image v3** via `intervention/image-laravel` para processar imagens em uploads (logo de tenant, avatares, etc.). Use este pacote como **padrão** sempre que for implementar ou alterar upload de imagens.

## Quando ativar

- Implementar novo upload de imagem (logo, avatar, banner).
- Redimensionar ou recortar imagem no servidor.
- Padronizar formato de saída (ex.: PNG/WebP).
- Alterar regras de tamanho ou qualidade de imagens já processadas.

## Uso no código

```php
use Intervention\Image\Laravel\Facades\Image;

// SVG: não processar com Intervention Image; gravar arquivo bruto.
if ($file->getMimeType() === 'image/svg+xml') {
    Storage::disk('public')->put($path, $file->get(), 'public');
    return $path;
}

// Raster: ler, redimensionar/recortar, encode, salvar
$image = Image::read($file->getRealPath())
    ->cover(256, 256, 'center');  // ou ->resize($w, $h)

$encoded = $image->encodeByExtension('png');  // ou 'webp', quality: 85
Storage::disk('public')->put($path, $encoded->toString(), 'public');
```

## Regras

1. **Validação:** Form Request com `mimetypes` e `max` (ex.: 1MB). SVG permitido apenas onde fizer sentido.
2. **SVG:** Se aceito no contexto, não passar SVG para `Image::read()`; gravar com `Storage::put(..., $file->get(), ...)`. No upload de logo do tenant só são aceitos jpeg, png e webp.
3. **Serviço:** Lógica de processamento no Service (Fat Service), não no Controller.
4. **Tamanho:** Definir constante de tamanho por contexto (ex.: logo 256x256, avatar 128x128).
5. **Config:** Usar `config/image.php` (driver GD ou Imagick; `autoOrientation => true` recomendado).

## Documentação

- Oficial: [Intervention Image v3](https://image.intervention.io/v3/getting-started/installation), [Laravel Integration](https://image.intervention.io/v3/getting-started/frameworks)
