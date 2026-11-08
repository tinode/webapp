#!/bin/sh
set -e

# 环境变量替换
API_KEY="${API_KEY:-AQAAAAABAAGn9LFimCi7U3ZKRXr2dyHR}"
TINODE_HOST="${TINODE_HOST:-im.callingclaw.app}"

echo "Configuring Web Client..."
echo "  API_KEY: ${API_KEY:0:20}..."
echo "  TINODE_HOST: $TINODE_HOST"

# 替换 UMD 文件中的 API key (如果环境变量与默认值不同)
if [ "$API_KEY" != "AQAAAAABAAGn9LFimCi7U3ZKRXr2dyHR" ]; then
    echo "Replacing API key in UMD files..."
    find /usr/share/nginx/html/umd -name "*.js" -type f -exec sed -i "s/AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K/$API_KEY/g" {} \;
    find /usr/share/nginx/html/umd -name "*.js" -type f -exec sed -i "s/AQAAAAABAAGn9LFimCi7U3ZKRXr2dyHR/$API_KEY/g" {} \;
fi

# 替换服务器地址
if [ "$TINODE_HOST" != "im.callingclaw.app" ]; then
    echo "Replacing Tinode host..."
    find /usr/share/nginx/html/umd -name "*.js" -type f -exec sed -i "s/im.callingclaw.app/$TINODE_HOST/g" {} \;
fi

echo "Starting Nginx..."
exec "$@"
