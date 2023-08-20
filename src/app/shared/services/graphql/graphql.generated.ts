export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function gql(literals: string | readonly string[]): string {
  if (typeof literals === 'string') literals = [literals];
  const query = literals[0] ?? '';
  return query.replace(/([\s,]|#[^\n\r]+)+/g, ' ').trim();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GraphQLOperation<TData, TVariables> {
  type: 'Query' | 'Mutation';
  name?: string;
  query: string;
  variables?: TVariables;
}

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
  extensions?: Record<string, unknown>;
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Activity = {
  /** Description or details of the activity */
  description?: Maybe<Array<Scalars['String']['output']>>;
  /** Duration spent doing the activity in minutes */
  duration: Scalars['Int']['output'];
  /** Name of the activity. Anwers "what `<Activity type>`"? */
  name: Scalars['String']['output'];
  /** Type of activity done */
  type: ActivityType;
};

export enum ActivityType {
  ANIME = 'ANIME',
  CODING = 'CODING',
  MOVIE = 'MOVIE',
  VIDEO = 'VIDEO',
  WEBNOVEL = 'WEBNOVEL',
}

export type AddExpenseInput = {
  /** Bill ID */
  bid?: InputMaybe<Scalars['String']['input']>;
  /** Category to which this bill belongs to */
  category?: InputMaybe<ExpenseCategory>;
  /** Bill currency */
  currency: Currency;
  /** Bill date in format YYMMDD */
  date: Scalars['Int']['input'];
  /** Description */
  desc?: InputMaybe<Scalars['String']['input']>;
  /** Bill items */
  items: Array<ExpenseItemInput>;
  /** Visibilty level of this expense */
  level?: InputMaybe<ExpenseVisibiltyLevel>;
  /** Payment mode or method */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  /** Store from which the expense is made */
  store: Scalars['String']['input'];
  /** Store location or branch name */
  storeLoc?: InputMaybe<Scalars['String']['input']>;
  /** Bill time in 24hr format HHMM */
  time?: InputMaybe<Scalars['Int']['input']>;
};

/** Supported currencies */
export enum Currency {
  GBP = 'GBP',
  INR = 'INR',
}

export type Exercise = {
  /** Calories burnt */
  calories: Scalars['Int']['output'];
  /** Duration excercised in minutes */
  duration: Scalars['Int']['output'];
  /** Start time of excercise in 24 hr format HHMM */
  time: Scalars['Int']['output'];
  /** List of workouts done */
  workouts: Array<Workout>;
};

export type Expense = {
  /** Bill ID */
  bid?: Maybe<Scalars['String']['output']>;
  /** Expense category */
  category: ExpenseCategory;
  /** Currency of the bill */
  currency: Currency;
  /** Date of the expense in the format YYMMDD */
  date: Scalars['Int']['output'];
  /** Description for this expense */
  desc?: Maybe<Scalars['String']['output']>;
  /** Expense ID */
  eid: Scalars['ID']['output'];
  /** Array containing the items in the expense or bill */
  items: Array<ExpenseItem>;
  /** Visibility level */
  level: ExpenseVisibiltyLevel;
  /** Payment mode or method */
  paymentMethod?: Maybe<Scalars['String']['output']>;
  /** Store name */
  store: Scalars['String']['output'];
  /** Store Location or branch name */
  storeLoc?: Maybe<Scalars['String']['output']>;
  /** Time of the bill in the 24 hour format HHMM */
  time?: Maybe<Scalars['Int']['output']>;
  /** Total amount in 1/100 of the basic monetary unit */
  total: Scalars['Int']['output'];
};

/** Supported expense categories */
export enum ExpenseCategory {
  BILLS = 'BILLS',
  CHARITY = 'CHARITY',
  EATING_OUT = 'EATING_OUT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  FAMILY = 'FAMILY',
  GENERAL = 'GENERAL',
  GIFTS = 'GIFTS',
  GROCERIES = 'GROCERIES',
  HOLIDAYS = 'HOLIDAYS',
  PERSONAL_CARE = 'PERSONAL_CARE',
  SHOPPING = 'SHOPPING',
  TRANSPORT = 'TRANSPORT',
  UNKNOWN = 'UNKNOWN',
}

export type ExpenseCategoryInsight = {
  billCount: Scalars['Int']['output'];
  name: ExpenseCategory;
  total: Scalars['Float']['output'];
};

export type ExpenseConnection = {
  items: Array<Expense>;
  /** Connection page details */
  page: PageInfo;
  /** Total count */
  totalCount: Scalars['Int']['output'];
};

export type ExpenseFilter = {
  category?: InputMaybe<ExpenseCategory>;
  currency?: InputMaybe<Currency>;
  fromDate?: InputMaybe<Scalars['Int']['input']>;
  levels?: InputMaybe<Array<ExpenseVisibiltyLevel>>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  store?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['Int']['input']>;
};

export type ExpenseInsight = {
  billCount: Scalars['Int']['output'];
  categories: Array<ExpenseCategoryInsight>;
  total: Scalars['Float']['output'];
};

export type ExpenseItem = {
  /** Name of the item */
  name: Scalars['String']['output'];
  /** Price of a unit item in 1/100 of the basic monetary unit, Eg: $ 1.50  = 150 */
  price: Scalars['Int']['output'];
  /** Quantity of the item */
  qty: Scalars['Float']['output'];
};

export type ExpenseItemInput = {
  /** Name of the item */
  name: Scalars['String']['input'];
  /** Price of a single unit item in 1/100 of the basic monetary unit */
  price: Scalars['Int']['input'];
  /** Quantity of the item */
  qty?: InputMaybe<Scalars['Float']['input']>;
};

/** The different visibility levels */
export enum ExpenseVisibiltyLevel {
  DISGUISE = 'DISGUISE',
  HIDDEN = 'HIDDEN',
  STANDARD = 'STANDARD',
}

export type Food = {
  /** Items in the menu */
  items: Array<Scalars['String']['output']>;
  /** Start time of eating in 24 hr format HHMM */
  time: Scalars['Int']['output'];
};

export type Insight = {
  expense: ExpenseInsight;
};

export type InsightExpenseArgs = {
  currency: Currency;
  levels?: InputMaybe<Array<ExpenseVisibiltyLevel>>;
};

export type Memoir = {
  /** Activities done on this day */
  activities: Array<Activity>;
  /** Date when this record is for. Date format is YYMMDD */
  date: Scalars['Int']['output'];
  /** Diary reords of this day */
  diary: Array<Scalars['String']['output']>;
  /** Events to be noted such as laundry, bedsheet change, etc */
  events: Array<Scalars['String']['output']>;
  /** Excercises done on this day */
  exercises: Array<Exercise>;
  /** Food ate this day */
  foods: Array<Food>;
  sleep?: Maybe<Sleep>;
};

export type Metadata = {
  /** Difference between the total sum of real and fake expenses */
  deviation: Scalars['Float']['output'];
  /** Payment methods or modes used by the user */
  paymentMethods: Array<Scalars['String']['output']>;
};

export type Mutation = {
  addActivityRecord: Activity;
  addDiaryRecord: Scalars['String']['output'];
  addEventRecord: Scalars['String']['output'];
  addExerciseRecord: Exercise;
  addExpense: Expense;
  addFoodRecord: Food;
  addSleepRecord: Sleep;
  deleteActivityRecord: Activity;
  deleteDiaryRecord: Scalars['String']['output'];
  deleteEventRecord: Scalars['String']['output'];
  deleteExerciseRecord: Exercise;
  deleteFoodRecord: Food;
  removeExpense: Expense;
  updateActivityRecord: Activity;
  updateDiaryRecord: Scalars['String']['output'];
  updateEventRecord: Scalars['String']['output'];
  updateExerciseRecord: Exercise;
  updateExpense: Expense;
  updateFoodRecord: Food;
};

export type MutationAddExpenseArgs = {
  input: AddExpenseInput;
};

export type MutationDeleteActivityRecordArgs = {
  date: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
};

export type MutationDeleteDiaryRecordArgs = {
  date: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
};

export type MutationDeleteEventRecordArgs = {
  date: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
};

export type MutationDeleteExerciseRecordArgs = {
  date: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
};

export type MutationDeleteFoodRecordArgs = {
  date: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
};

export type MutationRemoveExpenseArgs = {
  eid: Scalars['ID']['input'];
};

export type MutationUpdateExpenseArgs = {
  eid: Scalars['ID']['input'];
  update: UpdateExpenseInput;
};

export type PageInfo = {
  /** Has next page */
  hasNext: Scalars['Boolean']['output'];
  /** Has previous page */
  hasPrev: Scalars['Boolean']['output'];
};

export type PageInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  expense?: Maybe<Expense>;
  expenses: ExpenseConnection;
  insight: Insight;
  memoir: Memoir;
  metadata: Metadata;
};

export type QueryExpenseArgs = {
  eid: Scalars['ID']['input'];
};

export type QueryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilter>;
  page?: InputMaybe<PageInput>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type QueryInsightArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  week?: InputMaybe<Scalars['Int']['input']>;
  year: Scalars['Int']['input'];
};

export type QueryMemoirArgs = {
  date: Scalars['Int']['input'];
};

export type Sleep = {
  /** Bedtime in 24 hr format HHMM */
  bedtime?: Maybe<Scalars['Int']['output']>;
  /** Time slept in minutes */
  duration?: Maybe<Scalars['Int']['output']>;
  /** Wakeup time in 24 hr format HHMM */
  wakeup?: Maybe<Scalars['Int']['output']>;
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type UpdateExpenseInput = {
  /** Bill ID */
  bid?: InputMaybe<Scalars['String']['input']>;
  /** Category to which this bill belongs to */
  category?: InputMaybe<ExpenseCategory>;
  /** Bill currency */
  currency?: InputMaybe<Currency>;
  /** Bill date in format YYMMDD */
  date?: InputMaybe<Scalars['Int']['input']>;
  /** Description */
  desc?: InputMaybe<Scalars['String']['input']>;
  /** Bill items */
  items?: InputMaybe<Array<ExpenseItemInput>>;
  /** Visibilty level of this expense */
  level?: InputMaybe<ExpenseVisibiltyLevel>;
  /** Payment mode or method */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  /** Store from which the expense is made */
  store?: InputMaybe<Scalars['String']['input']>;
  /** Store location or branch name */
  storeLoc?: InputMaybe<Scalars['String']['input']>;
  /** Bill time in 24hr format HHMM */
  time?: InputMaybe<Scalars['Int']['input']>;
};

export type Workout = {
  /** Number of reps. If sets is not defined then this field denotes duration in minutes */
  reps: Scalars['Int']['output'];
  /** Number of sets done */
  sets?: Maybe<Scalars['Int']['output']>;
  /** Type of workout. For Eg planks, pull ups, etc */
  type: Scalars['String']['output'];
};

export type AddExpenseMutationVariables = Exact<{
  expense: AddExpenseInput;
}>;

export type AddExpenseMutation = { addExpense: { eid: string } };

export type GetExpenseQueryVariables = Exact<{
  eid: Scalars['ID']['input'];
}>;

export type GetExpenseQuery = {
  expense?: {
    eid: string;
    bid?: string | null;
    date: number;
    level: ExpenseVisibiltyLevel;
    time?: number | null;
    store: string;
    storeLoc?: string | null;
    category: ExpenseCategory;
    currency: Currency;
    paymentMethod?: string | null;
    desc?: string | null;
    total: number;
    items: Array<{ name: string; price: number; qty: number }>;
  } | null;
};

export type GetInsightQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  currency: Currency;
  levels?: InputMaybe<Array<ExpenseVisibiltyLevel> | ExpenseVisibiltyLevel>;
}>;

export type GetInsightQuery = { insight: { expense: { total: number; billCount: number; categories: Array<{ name: ExpenseCategory; total: number; billCount: number }> } } };

export type GetUserMetadataQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserMetadataQuery = { metadata: { deviation: number; paymentMethods: Array<string> } };

export type ListExpensesQueryVariables = Exact<{
  filter?: InputMaybe<ExpenseFilter>;
  page?: InputMaybe<PageInput>;
  sortOrder?: InputMaybe<SortOrder>;
}>;

export type ListExpensesQuery = {
  expenses: {
    totalCount: number;
    items: Array<{ eid: string; date: number; level: ExpenseVisibiltyLevel; store: string; category: ExpenseCategory; currency: Currency; total: number }>;
  };
};

const AddExpenseDocument = gql`
  mutation AddExpense($expense: AddExpenseInput!) {
    addExpense(input: $expense) {
      eid
    }
  }
`;

export const AddExpenseOperation: GraphQLOperation<AddExpenseMutation, AddExpenseMutationVariables> = { type: 'Mutation', name: 'AddExpense', query: AddExpenseDocument };

const GetExpenseDocument = gql`
  query GetExpense($eid: ID!) {
    expense(eid: $eid) {
      eid
      bid
      date
      level
      time
      store
      storeLoc
      category
      currency
      paymentMethod
      desc
      items {
        name
        price
        qty
      }
      total
    }
  }
`;

export const GetExpenseOperation: GraphQLOperation<GetExpenseQuery, GetExpenseQueryVariables> = { type: 'Query', name: 'GetExpense', query: GetExpenseDocument };

const GetInsightDocument = gql`
  query GetInsight($year: Int!, $month: Int!, $currency: Currency!, $levels: [ExpenseVisibiltyLevel!]) {
    insight(year: $year, month: $month) {
      expense(currency: $currency, levels: $levels) {
        total
        billCount
        categories {
          name
          total
          billCount
        }
      }
    }
  }
`;

export const GetInsightOperation: GraphQLOperation<GetInsightQuery, GetInsightQueryVariables> = { type: 'Query', name: 'GetInsight', query: GetInsightDocument };

const GetUserMetadataDocument = gql`
  query GetUserMetadata {
    metadata {
      deviation
      paymentMethods
    }
  }
`;

export const GetUserMetadataOperation: GraphQLOperation<GetUserMetadataQuery, GetUserMetadataQueryVariables> = {
  type: 'Query',
  name: 'GetUserMetadata',
  query: GetUserMetadataDocument,
};

const ListExpensesDocument = gql`
  query ListExpenses($filter: ExpenseFilter, $page: PageInput, $sortOrder: SortOrder) {
    expenses(filter: $filter, page: $page, sortOrder: $sortOrder) {
      totalCount
      items {
        eid
        date
        level
        store
        category
        currency
        total
      }
    }
  }
`;

export const ListExpensesOperation: GraphQLOperation<ListExpensesQuery, ListExpensesQueryVariables> = { type: 'Query', name: 'ListExpenses', query: ListExpensesDocument };
