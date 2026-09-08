import type { HomepageFaqGroup } from '@prisma/client';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow, LinkButton } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveHomepageFaq, deleteHomepageFaq } from '@/server/actions';

export const metadata = { title: 'Homepage questions' };
export const dynamic = 'force-dynamic';

type Question = {
  id: string;
  group: HomepageFaqGroup;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  order: number;
  visible: boolean;
};

/** The two blocks a question can belong to, and how each is described to an editor. */
const BLOCKS = [
  {
    group: 'NUMBERED' as const,
    title: 'Open questions (numbered)',
    description:
      'Shown high on the page as a numbered list with the answers always visible. Use these to name what an owner is unsure about.',
  },
  {
    group: 'ACCORDION' as const,
    title: 'Frequently asked questions',
    description: 'Shown near the bottom of the page, collapsed until a visitor opens one.',
  },
];

function QuestionFields({ group, q }: { group: HomepageFaqGroup; q?: Question }) {
  const key = q?.id ?? `new-${group}`;

  return (
    <>
      {q && <input type="hidden" name="id" value={q.id} />}
      <input type="hidden" name="group" value={q?.group ?? group} />
      <Grid>
        <Field label="Question (EN)" htmlFor={`questionEn-${key}`} required>
          <input
            id={`questionEn-${key}`}
            name="questionEn"
            defaultValue={q?.questionEn ?? ''}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Question (AR)" htmlFor={`questionAr-${key}`}>
          <input
            id={`questionAr-${key}`}
            name="questionAr"
            defaultValue={q?.questionAr ?? ''}
            dir="rtl"
            className={inputClass}
          />
        </Field>
        <Field label="Answer (EN)" htmlFor={`answerEn-${key}`} hint="Leave a blank line between paragraphs.">
          <textarea
            id={`answerEn-${key}`}
            name="answerEn"
            rows={4}
            defaultValue={q?.answerEn ?? ''}
            className={inputClass}
          />
        </Field>
        <Field label="Answer (AR)" htmlFor={`answerAr-${key}`}>
          <textarea
            id={`answerAr-${key}`}
            name="answerAr"
            rows={4}
            defaultValue={q?.answerAr ?? ''}
            dir="rtl"
            className={inputClass}
          />
        </Field>
      </Grid>

      <div className="mt-3 flex items-end gap-4">
        <Field label="Order" htmlFor={`order-${key}`} className="w-24">
          <input
            id={`order-${key}`}
            name="order"
            type="number"
            min={0}
            defaultValue={q?.order ?? 0}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
          <input
            name="visible"
            type="checkbox"
            defaultChecked={q?.visible ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Show on site
        </label>
      </div>
    </>
  );
}

function Block({ group, title, description, questions }: (typeof BLOCKS)[number] & { questions: Question[] }) {
  return (
    <section className="mb-8">
      <Card title={`Add to: ${title}`} description={description} className="mb-5">
        <InlineForm action={saveHomepageFaq} submitLabel="Add question">
          <QuestionFields group={group} />
        </InlineForm>
      </Card>

      <Card title={`${title} — ${questions.length} question(s)`}>
        {questions.length === 0 ? (
          <EmptyRow>No questions in this block yet.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {questions.map((q) => (
              <li key={q.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveHomepageFaq}
                  after={
                    <form action={deleteHomepageFaq}>
                      <input type="hidden" name="id" value={q.id} />
                      <SubmitButton
                        variant="danger"
                        className="!px-2.5 !py-1 !text-xs"
                        confirm={`Delete “${q.questionEn}”?`}
                      >
                        Delete
                      </SubmitButton>
                    </form>
                  }
                >
                  <QuestionFields group={group} q={q} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

export default async function HomepageQuestionsPage() {
  const rows = await prisma.homepageFaq.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });

  return (
    <>
      <PageHeader
        title="Homepage questions"
        description="Both question blocks on the homepage. A question is only published once “Show on site” is ticked."
        action={
          <LinkButton href="/admin/homepage" variant="secondary">
            Homepage copy
          </LinkButton>
        }
      />

      {BLOCKS.map((block) => (
        <Block key={block.group} {...block} questions={rows.filter((row) => row.group === block.group)} />
      ))}
    </>
  );
}
