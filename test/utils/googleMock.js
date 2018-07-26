'use strict'

const fs = require('fs')
const path = require('path')

const {simplePayload, rawPayload, multisectionPayload} = require('../fixtures/testHTML')

const spreadsheetBuf = (() => {
  return {data: fs.readFileSync(path.join(__dirname, '../fixtures/sheet-buffer'))}
})()

exports.initMocks = (google) => {
  google.auth.getApplicationDefault = () => {
    return {credential: {JWT: {}}}
  }
  google.options = () => {}
  google.drive = () => {
    return {
      files: {
        'export': ({mimeType, fileId}) => {
          if (mimeType.includes('spreadsheetml')) return spreadsheetBuf
          if (fileId === 'mulitsection') return multisectionPayload
          return simplePayload
        },
        'get': () => rawPayload
      },
      revisions: {
        get: () => {
          return Promise.resolve({ data: {
            kind: 'drive#revision',
            mimeType: 'application/vnd.google-apps.document',
            modifiedTime: '2017-01-01T19:55:07.353Z',
            published: false,
            lastModifyingUser: {
              kind: 'drive#user',
              displayName: 'John Smith',
              photoLink: 'https://foo.com/photo.jpg',
              me: false
            }
          }})
        }
      }
    }
  }
}
