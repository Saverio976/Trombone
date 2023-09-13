import { XRAPIDAPIKEY_YAHOOFINANCE_KEY, XRAPIDAPIKEY_YAHOOFINANCE_HOST, XRAPIDAPIKEY_YAHOOFINANCE_URL } from '@env';

const getKey = async (): Promise<string> => {
    return XRAPIDAPIKEY_YAHOOFINANCE_KEY;
}
const getHost = async (): Promise<string> => {
    return XRAPIDAPIKEY_YAHOOFINANCE_HOST;
}
const getUrlApi = async (): Promise<string> => {
    return XRAPIDAPIKEY_YAHOOFINANCE_URL;
}

export interface ItemSummary {
    name: string;
    values: number[];
    firstDate: Date;
    lastDate: Date;
};

interface Results {
    spark: {
        timestamp: string[];
        close: number[]
    };
    shortName: string;
}

interface MarketSummaryAndSparkResponse {
    result: Results[];
};

const jsonToItemSummaries = (json: {marketSummaryAndSparkResponse: MarketSummaryAndSparkResponse}): ItemSummary[] => {
    let summaries: ItemSummary[] = [];

    json.marketSummaryAndSparkResponse.result.forEach((item: Results) => {
        summaries.push({
            name: item.shortName,
            values: item.spark.close,
            firstDate: new Date(item.spark.timestamp[0] * 1000),
            lastDate: new Date(item.spark.timestamp[item.spark.timestamp.length - 1] * 1000)
        })
    })
    return summaries
}

export const getSummary = async (): Promise<ItemSummary[]> => {
    const url = await getUrlApi();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': await getKey(),
            'X-RapidAPI-Host': await getHost(),
        }
    };
    console.log(url, options)

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const values = jsonToItemSummaries(result);
        return values
    } catch (error) {
        console.error(error);
        return []
    }
}
