from django import template
from urllib.parse import urlencode

register = template.Library()

@register.simple_tag(takes_context=True)
def url_replace(context, **kwargs):
    """
    Добавляет или заменяет параметры в URL, сохраняя существующие
    """
    query = context['request'].GET.copy()
    
    for key, value in kwargs.items():
        if value is None:
            # Удаляем параметр если значение None
            if key in query:
                del query[key]
        else:
            # Устанавливаем новое значение
            query[key] = value
    
    return query.urlencode()