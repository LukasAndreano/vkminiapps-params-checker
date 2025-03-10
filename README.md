# Для чего?  

Пакет для проверки параметров запуска VK Mini Apps. Код взят из официальной [документации](https://vk.com/dev/vk_apps_launch_params?f=%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%2B%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%2B%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B8%2B%D0%BD%D0%B0%2BNode.js) и собран в один пакет для удобства использования.

## Начало работы с пакетом

Для начала установите пакет:

```bash
npm i vkminiapps-params-checker
```

Проинициализируйте его в своём проекте:

```javascript
const checkHash = require("vkminiapps-params-checker");
// или
import checkHash from "vkminiapps-params-checker";
```

Использование:

```javascript
const isValidParams = checkHash(
  "параметры запуска",
  "секретный ключ приложения"
);
```

Функция возвращает `true` или `false`.

### Пример

```javascript
const isValidParams = checkHash(
  "vk_access_token_settings=&vk_app_id=7948530&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1634454189&vk_user_id=172118960&sign=5lVUWU19M_xQpENllCGe2Mi-SGWC8K5i7FdkfHOwggA",
  "cBpgoP3d9WggrQ81qtNhw"
); // false
```
