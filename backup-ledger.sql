--
-- PostgreSQL database dump
--

\restrict rMWjmiv37wSk1aJcc19ELf0YuAF1AY6ncFzQ6ElMV1PF51KoSn35iTvAv1tjeXf

-- Dumped from database version 18.1 (Homebrew)
-- Dumped by pg_dump version 18.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_bank_accounts_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_bank_accounts_status AS ENUM (
    'ACTIVE',
    'PENDING',
    'SUSPENDED',
    'CLOSED'
);


ALTER TYPE public.enum_bank_accounts_status OWNER TO stidyllac;

--
-- Name: enum_bank_accounts_type; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_bank_accounts_type AS ENUM (
    'CHECKING',
    'SAVINGS',
    'BUSINESS',
    'CRYPTO',
    'VAULT'
);


ALTER TYPE public.enum_bank_accounts_type OWNER TO stidyllac;

--
-- Name: enum_beneficiaries_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_beneficiaries_status AS ENUM (
    'ACTIVE',
    'BLOCKED',
    'PENDING'
);


ALTER TYPE public.enum_beneficiaries_status OWNER TO stidyllac;

--
-- Name: enum_cards_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_cards_status AS ENUM (
    'active',
    'blocked',
    'expired',
    'pending'
);


ALTER TYPE public.enum_cards_status OWNER TO stidyllac;

--
-- Name: enum_idempotency_keys_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_idempotency_keys_status AS ENUM (
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public.enum_idempotency_keys_status OWNER TO stidyllac;

--
-- Name: enum_ledger_accounts_accountType; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public."enum_ledger_accounts_accountType" AS ENUM (
    'CUSTOMER',
    'SYSTEM_CLEARING',
    'SYSTEM_FEES',
    'SYSTEM_SUSPENSE',
    'TREASURY'
);


ALTER TYPE public."enum_ledger_accounts_accountType" OWNER TO stidyllac;

--
-- Name: enum_ledger_entries_type; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_ledger_entries_type AS ENUM (
    'DEBIT',
    'CREDIT'
);


ALTER TYPE public.enum_ledger_entries_type OWNER TO stidyllac;

--
-- Name: enum_ledger_event_stream_projectionStatus; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public."enum_ledger_event_stream_projectionStatus" AS ENUM (
    'PENDING',
    'PROJECTED',
    'FAILED'
);


ALTER TYPE public."enum_ledger_event_stream_projectionStatus" OWNER TO stidyllac;

--
-- Name: enum_outbox_events_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_outbox_events_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'DEAD_LETTER'
);


ALTER TYPE public.enum_outbox_events_status OWNER TO stidyllac;

--
-- Name: enum_replay_jobs_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_replay_jobs_status AS ENUM (
    'RUNNING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public.enum_replay_jobs_status OWNER TO stidyllac;

--
-- Name: enum_transactions_direction; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_transactions_direction AS ENUM (
    'CREDIT',
    'DEBIT'
);


ALTER TYPE public.enum_transactions_direction OWNER TO stidyllac;

--
-- Name: enum_transactions_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_transactions_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REVERSED',
    'CANCELLED'
);


ALTER TYPE public.enum_transactions_status OWNER TO stidyllac;

--
-- Name: enum_transactions_type; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_transactions_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL',
    'TRANSFER',
    'CARD_PAYMENT',
    'REFUND',
    'FEE',
    'REVERSAL'
);


ALTER TYPE public.enum_transactions_type OWNER TO stidyllac;

--
-- Name: enum_transfers_direction; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_transfers_direction AS ENUM (
    'OUTBOUND',
    'INBOUND'
);


ALTER TYPE public.enum_transfers_direction OWNER TO stidyllac;

--
-- Name: enum_transfers_status; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_transfers_status AS ENUM (
    'PENDING',
    'AUTHORIZED',
    'SETTLED',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REVERSED',
    'CANCELLED'
);


ALTER TYPE public.enum_transfers_status OWNER TO stidyllac;

--
-- Name: enum_transfers_transferType; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public."enum_transfers_transferType" AS ENUM (
    'INTERNAL',
    'SEPA',
    'SWIFT',
    'ACH',
    'FPS'
);


ALTER TYPE public."enum_transfers_transferType" OWNER TO stidyllac;

--
-- Name: enum_user_settings_profile_visibility; Type: TYPE; Schema: public; Owner: stidyllac
--

CREATE TYPE public.enum_user_settings_profile_visibility AS ENUM (
    'public',
    'private',
    'friends'
);


ALTER TYPE public.enum_user_settings_profile_visibility OWNER TO stidyllac;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO stidyllac;

--
-- Name: bank_accounts; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.bank_accounts (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "accountName" character varying(255) NOT NULL,
    iban character varying(255) NOT NULL,
    bic character varying(255) NOT NULL,
    "accountNumber" character varying(255) NOT NULL,
    currency character varying(255) DEFAULT 'EUR'::character varying,
    balance numeric(15,2) DEFAULT 0,
    "availableBalance" numeric(15,2) DEFAULT 0,
    type public.enum_bank_accounts_type DEFAULT 'CHECKING'::public.enum_bank_accounts_type,
    status public.enum_bank_accounts_status DEFAULT 'ACTIVE'::public.enum_bank_accounts_status,
    country character varying(255) DEFAULT 'FR'::character varying,
    "isJointAccount" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ledgerBalance" numeric(18,2) DEFAULT 0,
    "pendingBalance" numeric(18,2) DEFAULT 0,
    "blockedBalance" numeric(18,2) DEFAULT 0,
    "accountCategory" character varying(255) DEFAULT 'PERSONAL'::character varying,
    "isPrimary" boolean DEFAULT false,
    "isClosed" boolean DEFAULT false,
    "closedAt" timestamp with time zone,
    "ledgerAccountNumber" character varying(255),
    "isFrozen" boolean DEFAULT false,
    "allowsInternationalTransfers" boolean DEFAULT true,
    "dailyTransferLimit" numeric(18,2) DEFAULT 10000,
    "monthlyTransferLimit" numeric(18,2) DEFAULT 100000,
    "activatedAt" timestamp with time zone
);


ALTER TABLE public.bank_accounts OWNER TO stidyllac;

--
-- Name: bank_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.bank_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bank_accounts_id_seq OWNER TO stidyllac;

--
-- Name: bank_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.bank_accounts_id_seq OWNED BY public.bank_accounts.id;


--
-- Name: beneficiaries; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.beneficiaries (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "bankAccountId" integer,
    "beneficiaryName" character varying(255) NOT NULL,
    iban character varying(255) NOT NULL,
    bic character varying(255) NOT NULL,
    "bankName" character varying(255),
    country character varying(255) DEFAULT 'FR'::character varying,
    currency character varying(255) DEFAULT 'EUR'::character varying,
    "transferNetwork" character varying(255) DEFAULT 'SEPA'::character varying,
    status public.enum_beneficiaries_status DEFAULT 'ACTIVE'::public.enum_beneficiaries_status,
    "isVerified" boolean DEFAULT false,
    "isFavorite" boolean DEFAULT false,
    "lastUsedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.beneficiaries OWNER TO stidyllac;

--
-- Name: beneficiaries_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.beneficiaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.beneficiaries_id_seq OWNER TO stidyllac;

--
-- Name: beneficiaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.beneficiaries_id_seq OWNED BY public.beneficiaries.id;


--
-- Name: cards; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "cardHolderName" character varying(255) NOT NULL,
    number character varying(255) NOT NULL,
    "maskedNumber" character varying(255) NOT NULL,
    last4 character varying(4) NOT NULL,
    "expiryMonth" character varying(2) NOT NULL,
    "expiryYear" character varying(4) NOT NULL,
    cvv character varying(255) NOT NULL,
    iban character varying(255) NOT NULL,
    bic character varying(255) NOT NULL,
    currency character varying(255) DEFAULT 'EUR'::character varying,
    type character varying(255) DEFAULT 'VISA'::character varying,
    level character varying(255) DEFAULT 'CLASSIC'::character varying,
    physical boolean DEFAULT true,
    virtual boolean DEFAULT false,
    status public.enum_cards_status DEFAULT 'active'::public.enum_cards_status,
    "isFrozen" boolean DEFAULT false,
    "dailyLimit" numeric(12,2) DEFAULT 5000,
    "contactlessEnabled" boolean DEFAULT true,
    "activatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "bankAccountId" integer
);


ALTER TABLE public.cards OWNER TO stidyllac;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cards_id_seq OWNER TO stidyllac;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    user_id integer,
    passport_key character varying(255),
    id_card_key character varying(255),
    license_key character varying(255),
    is_verified boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.documents OWNER TO stidyllac;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO stidyllac;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: idempotency_keys; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.idempotency_keys (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    endpoint character varying(255) NOT NULL,
    method character varying(255) NOT NULL,
    status public.enum_idempotency_keys_status DEFAULT 'PROCESSING'::public.enum_idempotency_keys_status,
    response jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public.idempotency_keys OWNER TO stidyllac;

--
-- Name: idempotency_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.idempotency_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.idempotency_keys_id_seq OWNER TO stidyllac;

--
-- Name: idempotency_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.idempotency_keys_id_seq OWNED BY public.idempotency_keys.id;


--
-- Name: ledger_accounts; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.ledger_accounts (
    id integer NOT NULL,
    "userId" integer,
    "accountType" public."enum_ledger_accounts_accountType" NOT NULL,
    currency character varying(255) DEFAULT 'EUR'::character varying,
    balance numeric(18,2) DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ledger_accounts OWNER TO stidyllac;

--
-- Name: ledger_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.ledger_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ledger_accounts_id_seq OWNER TO stidyllac;

--
-- Name: ledger_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.ledger_accounts_id_seq OWNED BY public.ledger_accounts.id;


--
-- Name: ledger_entries; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.ledger_entries (
    id integer NOT NULL,
    "ledgerAccountId" integer NOT NULL,
    "transferId" integer,
    type public.enum_ledger_entries_type NOT NULL,
    amount numeric(18,2) NOT NULL,
    currency character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    reference character varying(255) DEFAULT 'TEMP-REF'::character varying NOT NULL,
    "originalAmount" numeric(18,2),
    "originalCurrency" character varying(255),
    "fxRate" numeric(18,6)
);


ALTER TABLE public.ledger_entries OWNER TO stidyllac;

--
-- Name: ledger_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.ledger_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ledger_entries_id_seq OWNER TO stidyllac;

--
-- Name: ledger_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.ledger_entries_id_seq OWNED BY public.ledger_entries.id;


--
-- Name: ledger_event_stream; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.ledger_event_stream (
    id bigint NOT NULL,
    "aggregateId" integer NOT NULL,
    "aggregateType" character varying(50) NOT NULL,
    "eventType" character varying(100) NOT NULL,
    reference character varying(100) NOT NULL,
    "userId" integer NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    "idempotencyKey" character varying(120),
    status character varying(30) DEFAULT 'PUBLISHED'::character varying NOT NULL,
    "projectionStatus" public."enum_ledger_event_stream_projectionStatus" DEFAULT 'PENDING'::public."enum_ledger_event_stream_projectionStatus" NOT NULL,
    "projectedAt" timestamp with time zone,
    source character varying(50) DEFAULT 'API'::character varying,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.ledger_event_stream OWNER TO stidyllac;

--
-- Name: ledger_event_stream_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.ledger_event_stream_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ledger_event_stream_id_seq OWNER TO stidyllac;

--
-- Name: ledger_event_stream_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.ledger_event_stream_id_seq OWNED BY public.ledger_event_stream.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    subscriber_id integer,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO stidyllac;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO stidyllac;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: outbox_events; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.outbox_events (
    id integer NOT NULL,
    "eventType" character varying(255),
    "aggregateId" integer,
    payload jsonb,
    status public.enum_outbox_events_status DEFAULT 'PENDING'::public.enum_outbox_events_status,
    "retryCount" integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.outbox_events OWNER TO stidyllac;

--
-- Name: outbox_events_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.outbox_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.outbox_events_id_seq OWNER TO stidyllac;

--
-- Name: outbox_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.outbox_events_id_seq OWNED BY public.outbox_events.id;


--
-- Name: personal_infos; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.personal_infos (
    id integer NOT NULL,
    user_id integer,
    gender character varying(10),
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    phone character varying(20),
    nationality character varying(100),
    occupation character varying(100),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.personal_infos OWNER TO stidyllac;

--
-- Name: personal_infos_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.personal_infos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_infos_id_seq OWNER TO stidyllac;

--
-- Name: personal_infos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.personal_infos_id_seq OWNED BY public.personal_infos.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO stidyllac;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO stidyllac;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: replay_jobs; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.replay_jobs (
    id bigint NOT NULL,
    status public.enum_replay_jobs_status NOT NULL,
    "aggregateId" bigint,
    "cursorId" bigint DEFAULT 0,
    "totalEvents" integer DEFAULT 0 NOT NULL,
    "processedEvents" integer DEFAULT 0 NOT NULL,
    "startedAt" timestamp with time zone NOT NULL,
    "finishedAt" timestamp with time zone,
    "errorMessage" text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.replay_jobs OWNER TO stidyllac;

--
-- Name: replay_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.replay_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.replay_jobs_id_seq OWNER TO stidyllac;

--
-- Name: replay_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.replay_jobs_id_seq OWNED BY public.replay_jobs.id;


--
-- Name: selfies; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.selfies (
    id integer NOT NULL,
    user_id integer,
    selfie_key character varying(255) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.selfies OWNER TO stidyllac;

--
-- Name: selfies_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.selfies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.selfies_id_seq OWNER TO stidyllac;

--
-- Name: selfies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.selfies_id_seq OWNED BY public.selfies.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO stidyllac;

--
-- Name: social_users; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.social_users (
    id integer NOT NULL,
    provider character varying(255) NOT NULL,
    provider_id character varying(255) NOT NULL,
    name character varying(255),
    email character varying(255),
    avatar_url character varying(255),
    user_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.social_users OWNER TO stidyllac;

--
-- Name: social_users_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.social_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_users_id_seq OWNER TO stidyllac;

--
-- Name: social_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.social_users_id_seq OWNED BY public.social_users.id;


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.subscribers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    verified boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.subscribers OWNER TO stidyllac;

--
-- Name: subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscribers_id_seq OWNER TO stidyllac;

--
-- Name: subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.subscribers_id_seq OWNED BY public.subscribers.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    "bankAccountId" integer NOT NULL,
    "cardId" integer,
    reference character varying(255),
    type public.enum_transactions_type NOT NULL,
    direction public.enum_transactions_direction NOT NULL,
    amount numeric(15,2) NOT NULL,
    currency character varying(255) DEFAULT 'EUR'::character varying,
    description character varying(255),
    status public.enum_transactions_status DEFAULT 'COMPLETED'::public.enum_transactions_status,
    "balanceBefore" numeric(15,2) DEFAULT 0,
    "balanceAfter" numeric(15,2) DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO stidyllac;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO stidyllac;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: transfers; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.transfers (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "senderAccountId" integer NOT NULL,
    "beneficiaryId" integer NOT NULL,
    reference character varying(255) NOT NULL,
    "transferType" public."enum_transfers_transferType" DEFAULT 'SEPA'::public."enum_transfers_transferType",
    direction public.enum_transfers_direction DEFAULT 'OUTBOUND'::public.enum_transfers_direction,
    amount numeric(18,2) NOT NULL,
    "feeAmount" numeric(18,2) DEFAULT 0,
    "exchangeRate" numeric(18,8) DEFAULT 1,
    "sourceCurrency" character varying(255) DEFAULT 'EUR'::character varying,
    "destinationCurrency" character varying(255) DEFAULT 'EUR'::character varying,
    description character varying(255),
    status public.enum_transfers_status DEFAULT 'PENDING'::public.enum_transfers_status,
    "executedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.transfers OWNER TO stidyllac;

--
-- Name: transfers_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.transfers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transfers_id_seq OWNER TO stidyllac;

--
-- Name: transfers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.transfers_id_seq OWNED BY public.transfers.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10),
    nationality character varying(100),
    occupation character varying(100),
    phone character varying(20),
    phone_alt character varying(20),
    telephone_fixe character varying(20),
    country_of_birth character varying(100),
    country_of_living character varying(100),
    state character varying(100),
    city character varying(100),
    address character varying(255),
    language_preference character varying(50),
    profile_photo character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO stidyllac;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO stidyllac;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.user_settings (
    id integer NOT NULL,
    user_id integer,
    email_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT false,
    marketing_emails boolean DEFAULT false,
    app_notifications boolean DEFAULT true,
    dark_mode boolean DEFAULT false,
    language character varying(10) DEFAULT 'en'::character varying,
    timezone character varying(40) DEFAULT 'UTC'::character varying,
    two_factor_enabled boolean DEFAULT false,
    auto_logout_minutes integer DEFAULT 30,
    profile_visibility public.enum_user_settings_profile_visibility DEFAULT 'private'::public.enum_user_settings_profile_visibility,
    show_email boolean DEFAULT false,
    show_phone boolean DEFAULT false,
    data_collection_opt_in boolean DEFAULT false,
    allow_tagging boolean DEFAULT true,
    auto_play_media boolean DEFAULT false,
    save_activity_history boolean DEFAULT true,
    content_language character varying(10) DEFAULT 'en'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.user_settings OWNER TO stidyllac;

--
-- Name: user_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.user_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_settings_id_seq OWNER TO stidyllac;

--
-- Name: user_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: stidyllac
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    is_confirmed boolean DEFAULT false NOT NULL,
    confirmation_token character varying(255),
    registration_method character varying(255),
    is_admin boolean DEFAULT false NOT NULL,
    tiktok_id character varying(255),
    confirmation_expires timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    verification_status character varying(255) DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO stidyllac;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: stidyllac
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO stidyllac;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stidyllac
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bank_accounts id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts ALTER COLUMN id SET DEFAULT nextval('public.bank_accounts_id_seq'::regclass);


--
-- Name: beneficiaries id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.beneficiaries ALTER COLUMN id SET DEFAULT nextval('public.beneficiaries_id_seq'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: idempotency_keys id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.idempotency_keys ALTER COLUMN id SET DEFAULT nextval('public.idempotency_keys_id_seq'::regclass);


--
-- Name: ledger_accounts id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_accounts ALTER COLUMN id SET DEFAULT nextval('public.ledger_accounts_id_seq'::regclass);


--
-- Name: ledger_entries id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_entries ALTER COLUMN id SET DEFAULT nextval('public.ledger_entries_id_seq'::regclass);


--
-- Name: ledger_event_stream id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_event_stream ALTER COLUMN id SET DEFAULT nextval('public.ledger_event_stream_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: outbox_events id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.outbox_events ALTER COLUMN id SET DEFAULT nextval('public.outbox_events_id_seq'::regclass);


--
-- Name: personal_infos id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.personal_infos ALTER COLUMN id SET DEFAULT nextval('public.personal_infos_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: replay_jobs id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.replay_jobs ALTER COLUMN id SET DEFAULT nextval('public.replay_jobs_id_seq'::regclass);


--
-- Name: selfies id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.selfies ALTER COLUMN id SET DEFAULT nextval('public.selfies_id_seq'::regclass);


--
-- Name: social_users id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.social_users ALTER COLUMN id SET DEFAULT nextval('public.social_users_id_seq'::regclass);


--
-- Name: subscribers id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.subscribers ALTER COLUMN id SET DEFAULT nextval('public.subscribers_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: transfers id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers ALTER COLUMN id SET DEFAULT nextval('public.transfers_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: user_settings id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250707010000-create-users.js
20250707010218-create-refresh_tokens.js
20250707012915-create-personal_info.js
20250707013649-create-document.js
20250707014502-create-selfie.js
20250707115641-create-user_profile.js
20250707115858-create-user_setting.js
20250718152126-create-social-user.js
20250718152304-create-subscriber.js
20250718152401-create-message.js
20260223201838-add-verification-status-to-users.js
20260507153255-create-cards-table.js
20260517051438-create-bank-accounts.js
20260517051846-update-cards-bank-account.js
20260517072131-create-transactions.js
20260517194123-update-bank-accounts-ledger-fields.js
20260518094632-create-beneficiaries.js
20260518101110-create-transfers.js
20260518155800-add-ledger-account-number.js
20260518185111-add-bank-account-operational-fields.js
20260519175957-update-transfer-status-enum.js
20260520145048-create-ledger_accounts.js
20260520150807-create-ledger_entries.js
20260520191735-convert-ledger-accountType-to-enum.js
20260521125844-add-reversal-to-transactions-enum.js
20260521143133-alter-ledger-entries-add-reference-fields.js
20260521164115-create-idempotency-keys.js
20260522010327-alter-idempotency-keys-financial-grade.js
20260523123914-create-outbox-events.js
20260524171215-add-fx-fields-to-ledger-entries.js
20260524184744-standardize-outbox-status-enum.js
20260525180417-create-event-store.js
20260531165117-create-ledger-event-stream-table.js
20260603123931-fix-ledger-event-stream-projection-status.js
20260605035932-remove-reference-unique-ledger-event-stream.js
20260605040751-drop-ledger-event-stream-unique-indexes.js
20260612122953-create-replay-jobs.js
\.


--
-- Data for Name: bank_accounts; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.bank_accounts (id, "userId", "accountName", iban, bic, "accountNumber", currency, balance, "availableBalance", type, status, country, "isJointAccount", "createdAt", "updatedAt", "ledgerBalance", "pendingBalance", "blockedBalance", "accountCategory", "isPrimary", "isClosed", "closedAt", "ledgerAccountNumber", "isFrozen", "allowsInternationalTransfers", "dailyTransferLimit", "monthlyTransferLimit", "activatedAt") FROM stdin;
3	21	IDYLLAC	FR7602173474608420145	IDYLFRPP	5850876290	EUR	500.00	500.00	CHECKING	ACTIVE	FR	f	2026-05-17 10:54:40.588+02	2026-06-21 17:35:58.955+02	500.00	0.00	0.00	PERSONAL	f	f	\N	\N	f	t	10000.00	100000.00	\N
\.


--
-- Data for Name: beneficiaries; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.beneficiaries (id, "userId", "bankAccountId", "beneficiaryName", iban, bic, "bankName", country, currency, "transferNetwork", status, "isVerified", "isFavorite", "lastUsedAt", "createdAt", "updatedAt") FROM stdin;
1	21	3	JOHN DOE	FR7612345678901234567890123	BNPAFRPP	BNP PARIBAS	FR	EUR	SEPA	ACTIVE	t	f	\N	2026-05-19 02:29:33.528495+02	2026-05-19 02:29:33.528495+02
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.cards (id, "userId", "cardHolderName", number, "maskedNumber", last4, "expiryMonth", "expiryYear", cvv, iban, bic, currency, type, level, physical, virtual, status, "isFrozen", "dailyLimit", "contactlessEnabled", "activatedAt", "createdAt", "updatedAt", "bankAccountId") FROM stdin;
3	21	IDYLLAC	4785 3754 6523 8048	**** **** **** 8048	8048	10	2030	614	FR7602173474608420145	IDYLFRPP	EUR	VISA	CLASSIC	t	f	active	f	5000.00	t	\N	2026-05-17 10:54:40.595+02	2026-05-17 10:54:40.595+02	3
4	21	IDYLLAC	4839 2591 3281 3924	**** **** **** 3924	3924	11	2030	527	FR767603658906493773	IDYLFRPP	EUR	VISA	CLASSIC	t	f	active	f	5000.00	t	\N	2026-05-17 12:04:36.98+02	2026-05-17 12:04:36.98+02	3
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.documents (id, user_id, passport_key, id_card_key, license_key, is_verified, verified_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: idempotency_keys; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.idempotency_keys (id, key, endpoint, method, status, response, "createdAt", "updatedAt", "userId") FROM stdin;
5	test-transfer-011	/api/transfers/create	POST	FAILED	{"error": "Transfer creation failed"}	2026-05-25 19:27:29.814+02	2026-05-25 19:27:29.839+02	21
6	test-013	/api/transfers/create	POST	FAILED	{"error": "Transfer creation failed"}	2026-05-26 00:11:59.523+02	2026-05-26 00:11:59.535+02	21
7	test-001	/api/transfers/create	POST	FAILED	{"error": "Transfer creation failed"}	2026-05-26 00:18:10.14+02	2026-05-26 00:18:10.15+02	21
8	test-014	/api/transfers/create	POST	FAILED	{"error": "Transfer creation failed"}	2026-05-26 01:35:23.925+02	2026-05-26 01:35:23.939+02	21
9	test-transfer-006	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 4}	2026-05-26 17:49:55.029+02	2026-05-26 17:49:55.081+02	21
10	settle-transfer-004	/api/transfers/settle/4	POST	FAILED	{"error": "Transfer settlement failed"}	2026-05-26 19:35:19.634+02	2026-05-26 19:35:19.662+02	21
11	settle-transfer-005	/api/transfers/settle/4	POST	FAILED	{"error": "Transfer settlement failed"}	2026-05-26 20:49:30.205+02	2026-05-26 20:49:30.224+02	21
12	settle-transfer-009	/api/transfers/settle/4	POST	COMPLETED	{"success": true, "transferId": 4}	2026-05-27 04:29:02.248+02	2026-05-27 04:29:02.275+02	21
32	create-transfer-test-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-01 10:31:31.333+02	2026-06-01 10:31:31.39+02	21
14	reverse-transfer-004-v2	/api/transfers/reverse/4	POST	COMPLETED	{"success": true, "transferId": 4}	2026-05-27 06:58:42.205+02	2026-05-27 07:12:04.355+02	21
15	transfer-v621-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 5}	2026-05-27 12:19:04.358+02	2026-05-27 12:19:04.388+02	21
16	settle-v621-001	/api/transfers/settle/5	POST	COMPLETED	{"success": true, "transferId": 5}	2026-05-27 12:25:02.766+02	2026-05-27 12:25:02.792+02	21
17	reverse-v621-001	/api/transfers/reverse/5	POST	FAILED	{"error": "Transfer reversal failed"}	2026-05-27 12:27:25.565+02	2026-05-27 12:27:25.584+02	21
33	settle-transfer-001	/api/transfers/settle/2	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-01 12:33:11.245+02	2026-06-01 12:33:11.276+02	21
29	create-transfer-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 1}	2026-05-29 04:49:33.352+02	2026-05-29 04:49:33.381+02	21
30	settle-transfer-001	/api/transfers/settle/1	POST	COMPLETED	{"success": true, "transferId": 1}	2026-05-29 04:52:29.49+02	2026-05-29 04:52:29.515+02	21
39	create-transfer-test-021	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 3}	2026-06-01 17:13:19.717+02	2026-06-01 17:13:19.773+02	21
40	settle-test-020	/api/transfers/settle/3	POST	COMPLETED	{"success": true, "transferId": 3}	2026-06-01 17:17:46.664+02	2026-06-01 17:17:46.686+02	21
44	create-transfer-v64-005	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 4}	2026-06-04 21:15:16.236+02	2026-06-04 21:15:16.263+02	21
45	create-transfer-final-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 5}	2026-06-04 23:36:15.616+02	2026-06-04 23:36:15.637+02	21
46	create-transfer-final-005	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 6}	2026-06-05 02:35:38.712+02	2026-06-05 02:35:38.744+02	21
47	lifecycle-create-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 7}	2026-06-05 06:30:08.696+02	2026-06-05 06:30:08.72+02	21
48	lifecycle-settle-001	/api/transfers/settle/6	POST	COMPLETED	{"success": true, "transferId": 6}	2026-06-05 06:52:33.226+02	2026-06-05 06:52:33.255+02	21
50	create-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-09 14:05:05.213+02	2026-06-09 14:05:05.265+02	21
51	settle-001	/api/transfers/settle/1	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-09 14:21:45.851+02	2026-06-09 14:21:45.878+02	21
53	create-002	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-09 15:11:01.542+02	2026-06-09 15:11:01.562+02	21
54	settle-002	/api/transfers/settle/2	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-09 15:17:16.329+02	2026-06-09 15:17:16.349+02	21
56	create-003	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-09 16:08:28.209+02	2026-06-09 16:08:28.226+02	21
57	settle-003	/api/transfers/settle/1	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-09 16:29:47.154+02	2026-06-09 16:29:47.182+02	21
64	transfer-test-001	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-16 14:58:24.637+02	2026-06-16 14:58:24.681+02	21
65	settle-transfer-002	/api/transfers/settle/1	POST	COMPLETED	{"success": true, "transferId": 1}	2026-06-17 15:08:01.58+02	2026-06-17 15:43:54.591+02	21
66	create-test-01	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-20 13:18:53.664+02	2026-06-20 13:18:53.704+02	21
67	create-test-01	/api/transfers/settle/2	POST	COMPLETED	{"success": true, "transferId": 2}	2026-06-20 13:29:41.987+02	2026-06-20 13:29:42.024+02	21
68	create-068	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 3}	2026-06-21 15:46:21.937+02	2026-06-21 15:46:22.002+02	21
69	settle-068	/api/transfers/settle/3	POST	COMPLETED	{"success": true, "transferId": 3}	2026-06-21 16:17:12.98+02	2026-06-21 16:17:13.017+02	21
70	create-069	/api/transfers/create	POST	COMPLETED	{"success": true, "transferId": 4}	2026-06-21 17:26:22.949+02	2026-06-21 17:26:22.975+02	21
71	settle-069	/api/transfers/settle/4	POST	COMPLETED	{"success": true, "transferId": 4}	2026-06-21 17:35:58.947+02	2026-06-21 17:35:58.974+02	21
\.


--
-- Data for Name: ledger_accounts; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.ledger_accounts (id, "userId", "accountType", currency, balance, "createdAt", "updatedAt") FROM stdin;
5	21	CUSTOMER	EUR	500.00	2026-05-21 03:26:57.341904+02	2026-06-21 17:35:58.971+02
1	\N	SYSTEM_CLEARING	EUR	500.00	2026-05-20 22:18:58.251296+02	2026-06-21 17:35:58.972+02
2	\N	SYSTEM_FEES	EUR	0.00	2026-05-20 22:18:58.251296+02	2026-05-20 22:18:58.251296+02
3	\N	SYSTEM_SUSPENSE	EUR	0.00	2026-05-20 22:18:58.251296+02	2026-05-20 22:18:58.251296+02
6	\N	TREASURY	EUR	0.00	2026-05-24 16:01:03.060885+02	2026-05-24 16:01:03.060885+02
7	\N	TREASURY	USD	0.00	2026-05-24 16:01:03.060885+02	2026-05-24 16:01:03.060885+02
8	\N	TREASURY	GBP	0.00	2026-05-24 16:01:03.060885+02	2026-05-24 16:01:03.060885+02
\.


--
-- Data for Name: ledger_entries; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.ledger_entries (id, "ledgerAccountId", "transferId", type, amount, currency, description, "createdAt", "updatedAt", reference, "originalAmount", "originalCurrency", "fxRate") FROM stdin;
1	5	1	DEBIT	100.00	EUR	Projection: SETTLED	2026-06-19 11:01:26.782+02	2026-06-19 11:01:26.782+02	TRF-1781614704668-SETTLEMENT	\N	\N	\N
2	1	1	CREDIT	100.00	EUR	Projection: SETTLED	2026-06-19 11:01:26.784+02	2026-06-19 11:01:26.784+02	TRF-1781614704668-SETTLEMENT	\N	\N	\N
3	5	2	DEBIT	50.00	EUR	Projection: SETTLED	2026-06-20 13:29:42.015+02	2026-06-20 13:29:42.015+02	TRF-1781954333687-SETTLEMENT	\N	\N	\N
4	1	2	CREDIT	50.00	EUR	Projection: SETTLED	2026-06-20 13:29:42.017+02	2026-06-20 13:29:42.017+02	TRF-1781954333687-SETTLEMENT	\N	\N	\N
5	5	3	DEBIT	150.00	EUR	Projection: SETTLED	2026-06-21 16:17:13.006+02	2026-06-21 16:17:13.006+02	TRF-1782049581977-SETTLEMENT	\N	\N	\N
6	1	3	CREDIT	150.00	EUR	Projection: SETTLED	2026-06-21 16:17:13.009+02	2026-06-21 16:17:13.009+02	TRF-1782049581977-SETTLEMENT	\N	\N	\N
7	5	4	DEBIT	200.00	EUR	Projection: SETTLED	2026-06-21 17:35:58.966+02	2026-06-21 17:35:58.966+02	TRF-1782055582960-SETTLEMENT	\N	\N	\N
8	1	4	CREDIT	200.00	EUR	Projection: SETTLED	2026-06-21 17:35:58.968+02	2026-06-21 17:35:58.968+02	TRF-1782055582960-SETTLEMENT	\N	\N	\N
\.


--
-- Data for Name: ledger_event_stream; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.ledger_event_stream (id, "aggregateId", "aggregateType", "eventType", reference, "userId", payload, "idempotencyKey", status, "projectionStatus", "projectedAt", source, version, "createdAt", "updatedAt") FROM stdin;
1	1	TRANSFER	TRANSFER_CREATED	TRF-1781614704668	21	{"amount": "100.00", "status": "PENDING", "transferId": 1, "beneficiaryId": 1, "senderAccountId": 3}	transfer-created-1	PUBLISHED	PROJECTED	2026-06-19 11:01:26.768+02	API	1	2026-06-16 14:58:24.678+02	\N
2	1	TRANSFER	TRANSFER_AUTHORIZED	TRF-1781614704668	21	{"status": "AUTHORIZED"}	transfer-authorized-1	PUBLISHED	PROJECTED	2026-06-19 11:01:26.77+02	API	1	2026-06-16 15:26:54.28+02	\N
3	1	TRANSFER	TRANSFER_PROCESSING	TRF-1781614704668	21	{"status": "PROCESSING"}	transfer-processing-1	PUBLISHED	PROJECTED	2026-06-19 11:01:26.778+02	API	1	2026-06-16 15:30:14.142+02	\N
5	1	TRANSFER	TRANSFER_SETTLED	TRF-1781614704668-SETTLEMENT	21	{"amount": 100, "currency": "EUR", "debitAccount": 5, "creditAccount": 1}	transfer-settled-1	PUBLISHED	PROJECTED	2026-06-19 11:01:26.785+02	API	1	2026-06-17 15:43:54.582+02	\N
6	2	TRANSFER	TRANSFER_CREATED	TRF-1781954333687	21	{"amount": "50.00", "status": "PENDING", "transferId": 2, "beneficiaryId": 1, "senderAccountId": 3}	transfer-created-2	PUBLISHED	PENDING	\N	API	1	2026-06-20 13:18:53.693+02	\N
7	2	TRANSFER	TRANSFER_AUTHORIZED	TRF-1781954333687	21	{"status": "AUTHORIZED"}	transfer-authorized-2	PUBLISHED	PENDING	\N	API	1	2026-06-20 13:21:56.385+02	\N
8	2	TRANSFER	TRANSFER_PROCESSING	TRF-1781954333687	21	{"status": "PROCESSING"}	transfer-processing-2	PUBLISHED	PENDING	\N	API	1	2026-06-20 13:23:06.518+02	\N
9	2	TRANSFER	TRANSFER_SETTLED	TRF-1781954333687-SETTLEMENT	21	{"amount": 50, "currency": "EUR", "debitAccount": 5, "creditAccount": 1}	transfer-settled-2	PUBLISHED	PENDING	\N	API	1	2026-06-20 13:29:42.007+02	\N
10	3	TRANSFER	TRANSFER_CREATED	TRF-1782049581977	21	{"amount": "150.00", "status": "PENDING", "transferId": 3, "beneficiaryId": 1, "senderAccountId": 3}	transfer-created-3	PUBLISHED	PENDING	\N	API	1	2026-06-21 15:46:21.987+02	\N
11	3	TRANSFER	TRANSFER_AUTHORIZED	TRF-1782049581977	21	{"status": "AUTHORIZED"}	transfer-authorized-3	PUBLISHED	PENDING	\N	API	1	2026-06-21 16:14:29.978+02	\N
12	3	TRANSFER	TRANSFER_PROCESSING	TRF-1782049581977	21	{"status": "PROCESSING"}	transfer-processing-3	PUBLISHED	PENDING	\N	API	1	2026-06-21 16:16:07.057+02	\N
13	3	TRANSFER	TRANSFER_SETTLED	TRF-1782049581977-SETTLEMENT	21	{"amount": 150, "currency": "EUR", "debitAccount": 5, "creditAccount": 1}	transfer-settled-3	PUBLISHED	PENDING	\N	API	1	2026-06-21 16:17:13.001+02	\N
14	4	TRANSFER	TRANSFER_CREATED	TRF-1782055582960	21	{"amount": "200.00", "status": "PENDING", "transferId": 4, "beneficiaryId": 1, "senderAccountId": 3}	transfer-created-4	PUBLISHED	PROJECTED	2026-06-21 17:26:22.973+02	API	1	2026-06-21 17:26:22.965+02	\N
15	4	TRANSFER	TRANSFER_AUTHORIZED	TRF-1782055582960	21	{"status": "AUTHORIZED"}	transfer-authorized-4	PUBLISHED	PROJECTED	2026-06-21 17:29:00.413+02	API	1	2026-06-21 17:29:00.406+02	\N
16	4	TRANSFER	TRANSFER_PROCESSING	TRF-1782055582960	21	{"status": "PROCESSING"}	transfer-processing-4	PUBLISHED	PROJECTED	2026-06-21 17:32:36.302+02	API	1	2026-06-21 17:32:36.297+02	\N
17	4	TRANSFER	TRANSFER_SETTLED	TRF-1782055582960-SETTLEMENT	21	{"amount": 200, "currency": "EUR", "debitAccount": 5, "creditAccount": 1}	transfer-settled-4	PUBLISHED	PROJECTED	2026-06-21 17:35:58.969+02	API	1	2026-06-21 17:35:58.961+02	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.messages (id, subscriber_id, message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: outbox_events; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.outbox_events (id, "eventType", "aggregateId", payload, status, "retryCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: personal_infos; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.personal_infos (id, user_id, gender, first_name, last_name, date_of_birth, phone, nationality, occupation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.refresh_tokens (id, user_id, token, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: replay_jobs; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.replay_jobs (id, status, "aggregateId", "cursorId", "totalEvents", "processedEvents", "startedAt", "finishedAt", "errorMessage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: selfies; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.selfies (id, user_id, selfie_key, is_verified, verified_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.session (sid, sess, expire) FROM stdin;
BxPthTb88e2vLPypAOsQ-_8dvfCKH1I6	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T13:46:22.004Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 15:46:23
BRnoFD4RXwMRoGWQ2evYal9qWFMIdReq	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:12:26.481Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:12:27
MBfcdyzsParFgbGbj3ECTj7Kzn_KCS9T	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:14:29.992Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:14:30
k0YkJ_zu1EeNtPnZSWV3EFTdZxr5QHQh	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:16:07.069Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:16:08
dz0YBINsod42O3Dq7C5gzajFYC-razmL	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:24:29.474Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:24:30
mVu3_tOoyh5fUoDi74tXc68x-qf41BfL	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T15:26:22.976Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 17:26:23
8T6nJLjdtCfMIYFE5-NjYokCyCxa23t_	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T15:32:36.305Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 17:32:37
9aDCom_6tUUH2XTIBeM6jTtqmb_5_jGf	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T15:51:15.902Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 17:51:16
EqkMj1siz0eunCJOSGtgej832Q42jaVk	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T13:16:35.463Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 15:16:36
fCUxkWlDso0TuaffH72ihXgj0rISvkRW	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:15:21.603Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:15:22
mp_1-u4Q0Cf1Ge-6AJwaawn5qbUZ3Bbh	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T14:17:13.018Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 16:17:14
HqfmSyFzdN0yOzlVoblbq32icxcAvSe9	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T13:18:47.115Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 15:18:48
JMQQwaz7daQ2WFPK4sa4jHOS0_J8Q28P	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T15:29:00.416Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 17:29:01
0SOVuNB-FJmefNqXwUHTVtT-e6UAeFUi	{"cookie":{"originalMaxAge":86400000,"expires":"2026-06-22T15:35:58.975Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"flash":{}}	2026-06-22 17:35:59
\.


--
-- Data for Name: social_users; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.social_users (id, provider, provider_id, name, email, avatar_url, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.subscribers (id, email, verified, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.transactions (id, "bankAccountId", "cardId", reference, type, direction, amount, currency, description, status, "balanceBefore", "balanceAfter", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.transfers (id, "userId", "senderAccountId", "beneficiaryId", reference, "transferType", direction, amount, "feeAmount", "exchangeRate", "sourceCurrency", "destinationCurrency", description, status, "executedAt", "createdAt", "updatedAt") FROM stdin;
1	21	3	1	TRF-1781614704668	SEPA	OUTBOUND	100.00	0.00	1.00000000	EUR	EUR	SEPA transfer test	SETTLED	\N	2026-06-16 14:58:24.669+02	2026-06-17 15:43:54.588+02
2	21	3	1	TRF-1781954333687	SEPA	OUTBOUND	50.00	0.00	1.00000000	EUR	EUR	\N	SETTLED	\N	2026-06-20 13:18:53.687+02	2026-06-20 13:29:42.023+02
3	21	3	1	TRF-1782049581977	SEPA	OUTBOUND	150.00	0.00	1.00000000	EUR	EUR	NEW Lifecycle test	SETTLED	\N	2026-06-21 15:46:21.977+02	2026-06-21 16:17:13.016+02
4	21	3	1	TRF-1782055582960	SEPA	OUTBOUND	200.00	0.00	1.00000000	EUR	EUR	NEW LIFECYCLE TEST	SETTLED	\N	2026-06-21 17:26:22.96+02	2026-06-21 17:35:58.973+02
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.user_profiles (id, user_id, first_name, last_name, date_of_birth, gender, nationality, occupation, phone, phone_alt, telephone_fixe, country_of_birth, country_of_living, state, city, address, language_preference, profile_photo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.user_settings (id, user_id, email_notifications, sms_notifications, marketing_emails, app_notifications, dark_mode, language, timezone, two_factor_enabled, auto_logout_minutes, profile_visibility, show_email, show_phone, data_collection_opt_in, allow_tagging, auto_play_media, save_activity_history, content_language, created_at, updated_at) FROM stdin;
2	21	t	f	f	t	f	en	UTC	f	30	private	f	f	f	t	f	t	en	2026-06-01 06:48:21.025+02	2026-06-01 07:50:22.496+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: stidyllac
--

COPY public.users (id, name, email, password, is_confirmed, confirmation_token, registration_method, is_admin, tiktok_id, confirmation_expires, created_at, updated_at, verification_status) FROM stdin;
21	IDYLLAC	victor.via7@gmail.com	$2b$10$ov0Wz5Wi5s5rPcHTUx4uKu.N8baQgy9P5tN1242jd/PSRIARYmRAO	t	\N	\N	t	\N	\N	2026-05-08 03:45:29.463+02	2026-05-08 03:46:07.121+02	pending
\.


--
-- Name: bank_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.bank_accounts_id_seq', 3, true);


--
-- Name: beneficiaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.beneficiaries_id_seq', 1, true);


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.cards_id_seq', 4, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.documents_id_seq', 2, true);


--
-- Name: idempotency_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.idempotency_keys_id_seq', 71, true);


--
-- Name: ledger_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.ledger_accounts_id_seq', 8, true);


--
-- Name: ledger_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.ledger_entries_id_seq', 8, true);


--
-- Name: ledger_event_stream_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.ledger_event_stream_id_seq', 17, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: outbox_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.outbox_events_id_seq', 1, false);


--
-- Name: personal_infos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.personal_infos_id_seq', 2, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 437, true);


--
-- Name: replay_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.replay_jobs_id_seq', 1, false);


--
-- Name: selfies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.selfies_id_seq', 2, true);


--
-- Name: social_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.social_users_id_seq', 1, false);


--
-- Name: subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.subscribers_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.transfers_id_seq', 4, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 1, true);


--
-- Name: user_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.user_settings_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stidyllac
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: bank_accounts bank_accounts_accountNumber_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT "bank_accounts_accountNumber_key" UNIQUE ("accountNumber");


--
-- Name: bank_accounts bank_accounts_iban_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_iban_key UNIQUE (iban);


--
-- Name: bank_accounts bank_accounts_ledgerAccountNumber_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT "bank_accounts_ledgerAccountNumber_key" UNIQUE ("ledgerAccountNumber");


--
-- Name: bank_accounts bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: beneficiaries beneficiaries_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT beneficiaries_pkey PRIMARY KEY (id);


--
-- Name: cards cards_iban_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_iban_key UNIQUE (iban);


--
-- Name: cards cards_number_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_number_key UNIQUE (number);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: idempotency_keys idempotency_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.idempotency_keys
    ADD CONSTRAINT idempotency_keys_pkey PRIMARY KEY (id);


--
-- Name: ledger_accounts ledger_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_accounts
    ADD CONSTRAINT ledger_accounts_pkey PRIMARY KEY (id);


--
-- Name: ledger_entries ledger_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_pkey PRIMARY KEY (id);


--
-- Name: ledger_event_stream ledger_event_stream_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.ledger_event_stream
    ADD CONSTRAINT ledger_event_stream_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: outbox_events outbox_events_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.outbox_events
    ADD CONSTRAINT outbox_events_pkey PRIMARY KEY (id);


--
-- Name: personal_infos personal_infos_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.personal_infos
    ADD CONSTRAINT personal_infos_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);


--
-- Name: replay_jobs replay_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.replay_jobs
    ADD CONSTRAINT replay_jobs_pkey PRIMARY KEY (id);


--
-- Name: selfies selfies_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.selfies
    ADD CONSTRAINT selfies_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: social_users social_users_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.social_users
    ADD CONSTRAINT social_users_pkey PRIMARY KEY (id);


--
-- Name: social_users social_users_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.social_users
    ADD CONSTRAINT social_users_provider_id_key UNIQUE (provider_id);


--
-- Name: subscribers subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_email_key UNIQUE (email);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_reference_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_reference_key UNIQUE (reference);


--
-- Name: transfers transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_pkey PRIMARY KEY (id);


--
-- Name: transfers transfers_reference_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_reference_key UNIQUE (reference);


--
-- Name: idempotency_keys unique_idempotency_request; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.idempotency_keys
    ADD CONSTRAINT unique_idempotency_request UNIQUE ("userId", key, endpoint, method);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_tiktok_id_key; Type: CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tiktok_id_key UNIQUE (tiktok_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: ledger_event_stream_aggregate_id; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX ledger_event_stream_aggregate_id ON public.ledger_event_stream USING btree ("aggregateId");


--
-- Name: ledger_event_stream_event_type; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX ledger_event_stream_event_type ON public.ledger_event_stream USING btree ("eventType");


--
-- Name: ledger_event_stream_projection_status; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX ledger_event_stream_projection_status ON public.ledger_event_stream USING btree ("projectionStatus");


--
-- Name: ledger_event_stream_user_id; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX ledger_event_stream_user_id ON public.ledger_event_stream USING btree ("userId");


--
-- Name: replay_jobs_aggregate_id; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX replay_jobs_aggregate_id ON public.replay_jobs USING btree ("aggregateId");


--
-- Name: replay_jobs_status; Type: INDEX; Schema: public; Owner: stidyllac
--

CREATE INDEX replay_jobs_status ON public.replay_jobs USING btree (status);


--
-- Name: bank_accounts bank_accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: beneficiaries beneficiaries_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT "beneficiaries_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: beneficiaries beneficiaries_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT "beneficiaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cards cards_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "cards_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cards cards_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.subscribers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: personal_infos personal_infos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.personal_infos
    ADD CONSTRAINT personal_infos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: selfies selfies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.selfies
    ADD CONSTRAINT selfies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transactions transactions_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.bank_accounts(id) ON UPDATE CASCADE;


--
-- Name: transactions transactions_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public.cards(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transfers transfers_beneficiaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "transfers_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES public.beneficiaries(id) ON UPDATE CASCADE;


--
-- Name: transfers transfers_senderAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "transfers_senderAccountId_fkey" FOREIGN KEY ("senderAccountId") REFERENCES public.bank_accounts(id) ON UPDATE CASCADE;


--
-- Name: transfers transfers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "transfers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stidyllac
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rMWjmiv37wSk1aJcc19ELf0YuAF1AY6ncFzQ6ElMV1PF51KoSn35iTvAv1tjeXf

