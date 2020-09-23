import GithubSlugger from 'github-slugger';

/**
 * Converts any object to string accepted by _Slugger_.
 * This is needed, because sometimes we receive pure string node,
 * but sometimes (e.g. when using styled text), we receive whole object (React.Element)
 *
 * @param {any} node React Node object to stringify
 */
export const toString = (node: any): string => {
  if (typeof node === 'string') {
    return node;
  } else if (Array.isArray(node)) {
    return node.map(toString).join('');
  } else if (node.props.children) {
    return toString(node.props.children);
  } else {
    return '';
  }
};

export const generateSlug = (slugger: GithubSlugger, node: any, length = 7): string => {
  const stringToSlug = toString(node)
    .split(' ')
    .splice(0, length)
    .join('-');

  // NOTE(jim): This will strip out commas from stringToSlug
  const slug = slugger.slug(stringToSlug);

  return slug;
};

export const isVersionedUrl = (url: string) => {
  return /https?:\/\/(.*)(\/versions\/.*)/.test(url);
};

export const replaceVersionInUrl = (url: string, replaceWith: string) => {
  const urlArr = url.split('/');
  urlArr[2] = replaceWith;
  return urlArr.join('/');
};

export const getVersionFromUrl = (url: string) => {
  return url.split('/')[2];
};

/**
 * Get the user facing or human-readable version from the SDK verion.
 * If you provide a `latestVersion`, `latest` will include the sdk version in parentheses.
 */
export const getUserFacingVersionString = (version: string, latestVersion?: string): string => {
  if (version === 'latest') {
    return latestVersion ? `Latest (${getUserFacingVersionString(latestVersion)})` : 'Latest';
  } else if (version === 'unversioned') {
    return 'Unversioned';
  } else {
    return `SDK${version.substring(1, 3)}`;
  }
};
