/**
 * @fileoverview Custom Elements Manifest analyzer configuration.
 * Tells the cem analyzer which files to scan and where to output custom-elements.json.
 */

export default {
  /** Globs to analyze */
  globs: ['components/*.js'],
  /** Directories to exclude from analysis */
  exclude: ['node_modules', 'pkg', 'lib'],
  /** Output directory for custom-elements.json */
  outdir: '.',
  /** Runs in JavaScript module mode */
  modules: true,
};
