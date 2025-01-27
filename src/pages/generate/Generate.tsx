import DefaultLayout from '@/layouts/default'

export default function GeneratePage() {
  return (
    <DefaultLayout>
      <section id='chat' className='flex-grow flex items-center justify-center'>
        <span className='text-lg lg:text-xl text-default-600'>Generate</span>
      </section>
    </DefaultLayout>
  )
}
