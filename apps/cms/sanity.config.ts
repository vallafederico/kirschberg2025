import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {structure} from './desk/structure'
import {noteField} from 'sanity-plugin-note-field'
// import { userGuidePlugin } from "@q42/sanity-plugin-user-guide";
// import { userGuideStructure } from "./guides/userGuideStructure";
import {crawlMeMaybe} from '@crawl-me-maybe/sanity'
import {DOMAIN, SANITY_CONFIG} from '@local/config'
// import { presentationTool } from "sanity/presentation";
import {muxInput} from 'sanity-plugin-mux-input'

const sharedConfig = [
  structureTool({
    name: 'studio',
    title: 'Studio',
    structure,
  }),
  media(),
  noteField(),
  muxInput(),
  // userGuidePlugin({ userGuideStructure }),
  crawlMeMaybe(),
  // presentationTool({
  // 	previewUrl: {
  // 		initial: DOMAIN,
  // 		origin: DOMAIN,
  // 		previewMode: {
  // 			enable: "/api/preview-enable",
  // 			disable: "/api/preview-disable",
  // 		},
  // 	},
  // 	allowOrigins: ["http://localhost:*", DOMAIN],
  // 	resolve,
  // }),
]

const devConfig = [visionTool()]

export default defineConfig({
  ...SANITY_CONFIG,
  scheduledPublishing: {enabled: false}, // enable if client pays for this feature

  plugins: [...sharedConfig, ...devConfig],
  schema: {
    types: schemaTypes,
  },
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
      },
    },
  },
})
