import { getMarks as getRecords } from '@pkg/datalayer/repositories/marks'

import { MarkImgFile as RecordImgFile } from '@/components/pkm/MarkImgFile'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Marks'
  const records = getRecords()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <Grid minColWidth="20ch">
          {records.map((record, i) => {
            const isOdd = i % 2 === 0
            const bgClass = isOdd ? 'bg-nxt-b3' : 'bg-nxt-b3'

            return (
              <div
                className={'flex gap-4 flex-col items-start p-4 rounded-lg ' + bgClass}
                key={record.id}
              >
                <div className="w-16 h-16">
                  <RecordImgFile id={'alpha-mark'} />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-nxt-w2">{record.name}</div>
                  <div className="text-sm text-nxt-w1">{record.desc}</div>
                </div>
              </div>
            )
          })}
        </Grid>
      </div>
    </Flex>
  )
}
