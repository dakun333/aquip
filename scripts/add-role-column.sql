-- 检查并添加 role 字段到 user 表

-- 首先检查 role 字段是否存在
DO $$
BEGIN
    -- 检查 Role 枚举是否存在
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EDITOR');
    END IF;
    
    -- 检查 role 列是否存在
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user' 
        AND column_name = 'role'
    ) THEN
        -- 添加 role 列
        ALTER TABLE "user" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';
        RAISE NOTICE 'role 字段已添加到 user 表';
    ELSE
        RAISE NOTICE 'role 字段已存在';
    END IF;
END $$;

