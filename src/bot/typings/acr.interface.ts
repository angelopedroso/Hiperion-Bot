type externalMD = {
  spotify: {
    album: { id: string; name: string }
    track: { name: string; id: string }
  }
  youtube: { vid: string }
  deezer: {
    album: { id: number; name: string }
    track: { name: string; id: string }
  }
}

type Music = {
  external_ids: {
    isrc: string
    upc: string
  }
  external_metadata: externalMD
  sample_begin_time_offset_ms: string
  label: string
  play_offset_ms: number
  artists: {
    name: string
  }[]
  release_date: string
  title: string
  db_end_time_offset_ms: string
  duration_ms: number
  album: {
    name: string
  }
  acrid: string
  result_from: number
  db_begin_time_offset_ms: string
  score: number
}

export type ACRCloudResponse = {
  status: {
    msg: string
    code: number
    version: string
  }
  metadata: {
    played_duration: number
    music: Music[]
    timestamp_utc: string
  }
  result_type: number
  sample_end_time_offset_ms: string
}
