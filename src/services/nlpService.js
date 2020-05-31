import { extract, setSanitizeHtmlOptions } from 'article-parser';
import htmlToText from 'html-to-text';
import { SummarizerManager } from 'node-summarizer';
import summarize from 'text-summarization';
import axios from 'axios';
import unfluff from 'unfluff';
import dayjs from 'dayjs';

export const getArticle = async (url) => {
  const res = await axios.get(url);
  const { data } = res;

  const article = unfluff(data, 'en');

  return Promise.resolve(article);
};

export const summarizeUrl = async (url) => {
  const article = await getArticle(url);
  const { title, date, publisher, text, author = [null] } = article;

  const datePublished = dayjs(date).toISOString();

  const Summarizer = new SummarizerManager(text, 6);
  const { summary } = await Summarizer.getSummaryByRank();

  const snippetSummary = await summarize({ text });
  const { extractive: snippets } = snippetSummary;

  return Promise.resolve({
    title,
    authors: author,
    datePublished,
    publisher,
    snippets,
    summary,
  });
};

export const summarizeText = async (text) => {
  const Summarizer = new SummarizerManager(text, 6);
  const { summary } = await Summarizer.getSummaryByRank();

  const snippetSummary = await summarize({ text });
  const { extractive: snippets } = snippetSummary;

  return Promise.resolve({
    snippets,
    summary,
  });
};
