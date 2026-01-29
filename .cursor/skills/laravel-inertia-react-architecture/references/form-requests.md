# Form Requests - Validação

Form Requests são obrigatórios para validação. **NUNCA** faça validação inline no Controller.

## Template Base

```php
<?php
declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateExampleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // ou lógica de autorização
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'field' => 'required|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'field.required' => __('validation.field.required'),
        ];
    }
}
```

## Regras SEMPRE Aplicadas

1. ✅ SEMPRE extraia mensagens para arquivos de tradução
2. ✅ SEMPRE use `authorize()` para verificar permissões
3. ✅ NUNCA faça validação inline no controller

## Uso no Controller

```php
public function store(CreateExampleRequest $request): Response
{
    // $request->validated() já contém apenas dados validados
    $data = $request->validated();
    $example = $this->service->create($data);
    return redirect()->route('examples.index');
}
```

## Mensagens de Validação

**SEMPRE** use arquivos de tradução:

```php
// resources/lang/pt_BR/validation.php
return [
    'field.required' => 'O campo :attribute é obrigatório.',
    'field.max' => 'O campo :attribute não pode ter mais de :max caracteres.',
];
```

## Validação Condicional

```php
public function rules(): array
{
    $rules = [
        'email' => 'required|email|unique:users,email',
    ];
    
    // Adicionar regra condicional
    if ($this->isMethod('PUT')) {
        $rules['email'] .= ',' . $this->route('user')->id;
    }
    
    return $rules;
}
```

## Validação Customizada

```php
use Illuminate\Validation\Rule;

public function rules(): array
{
    return [
        'status' => [
            'required',
            Rule::in(['pending', 'confirmed', 'cancelled']),
        ],
    ];
}
```
