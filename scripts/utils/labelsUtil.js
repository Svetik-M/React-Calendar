import labels from '../../labels/en-GB.json';

export default function labelsUtil(key) {
  return labels[key] || key;
}
