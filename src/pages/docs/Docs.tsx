import DefaultLayout from '@/layouts/default'
import DocsGrid from './_components/DocsGrid'

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section id='docs' className='flex-grow flex flex-col items-center justify-center gap-5 py-5'>
        <span className='text-lg sm:text-xl'>Simplified Profile Risk Understanding!</span>
        <DocsGrid />
      </section>
    </DefaultLayout>
  )
}
