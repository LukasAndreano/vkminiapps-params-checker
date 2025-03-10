import * as crypto from "node:crypto";

/**
 * Объект с ключом и значением параметра.
 */
export interface QueryParamsInterface {
	key: string;
	value: string;
}

/**
 * Проверяет хэш параметров запроса с использованием заданного ключа.
 *
 * @param {string} params - Строка параметров запроса, возможно начинающаяся с "?".
 * @param {string} key - Ключ для создания HMAC.
 * @returns {boolean} Возвращает true, если хэш параметров совпадает с переданным знаком, иначе false.
 */
const checkHash = (params: string, key: string): boolean => {
	// Инициализация переменной для хранения знака
	let sign: string | undefined;

	// Массив для хранения параметров с префиксом vk_
	const queryParams: QueryParamsInterface[] = [];

	/**
	 * Обрабатывает параметры запроса, фильтруя их по префиксу vk_ и знаку.
	 *
	 * @param {QueryParamsInterface} param - Объект с ключом и значением параметра.
	 */
	const processQueryParam = ({ key, value }: QueryParamsInterface) => {
		if (typeof value === "string") {
			if (key === "sign") {
				sign = value;
			} else if (key.startsWith("vk_")) {
				queryParams.push({ key, value });
			}
		}
	};

	// Проверка, начинается ли строка параметров с "?"
	const formattedSearch = params.startsWith("?") ? params.slice(1) : params;

	// Разделение параметров по "&" и обработка каждого параметра
	for (const param of formattedSearch.split("&")) {
		const [key, value] = param.split("=");
		processQueryParam({ key, value });
	}

	// Проверка наличия знака и параметров с префиксом vk_
	if (!sign || queryParams.length === 0) return false;

	// Сортировка параметров по ключу и создание строки запроса
	const queryString = new URLSearchParams(
		queryParams
			.sort((a, b) => a.key.localeCompare(b.key))
			.map(({ key, value }) => [key, value]),
	).toString();

	// Создание хэша из строки запроса и сравнение его с переданным знаком
	const paramsHash = crypto
		.createHmac("sha256", key)
		.update(queryString)
		.digest()
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=$/, "");

	return paramsHash === sign;
};

export default checkHash;
