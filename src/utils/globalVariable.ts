const socialMediaRegex =
  /https(?::\/\/(?:www|pin|br)\.(it|pinterest\.com\/|pinterest\.pt\/|pinterest\.br\/))|https(?::\/\/(?:www|www\.vm|vm|www.m|m)\.(tiktok\.com\/?))|(?:https?:\/\/)?(?:www\.)?(instagram\.com\/?)|(?:https?:\/\/)?(?:www\.)?(mbasic\.facebook|m\.facebook|facebook|fb)\.(com|me|watch)\/?(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)|(?:https?:\/\/)?(?:www\.)?(t|twitter)\.(com|co)\/?(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)|(?:https?:\/\/(?:chat\.whatsapp\.com|wa\.me)|chat\.whatsapp\.com|wa\.me)\/?|http(?::\/\/(?:www\.youtube\.com|youtu\.be|youtube\.com)\/?)/i

const isUrl =
  /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/im

export { socialMediaRegex, isUrl }
