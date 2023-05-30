import { getLocations as getRecords } from '@pkg/datalayer/repositories/locations'

// import { ItemImgFile as RecordImgFile } from '@/components/pkm/ItemImgFile'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Locations'
  const records = getRecords()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <Grid minColWidth="32ch">
          {records.map((record, i) => {
            const isOdd = i % 2 === 0
            const bgClass = isOdd ? 'bg-nxt-b3' : 'bg-nxt-b3'

            return (
              <div
                className={'flex gap-4 flex-col items-start p-4 rounded-lg ' + bgClass}
                key={record.id}
              >
                <div className="flex-1">
                  <div className="text-sm text-nxt-w1 font-mono">{record.id}</div>
                  <div className="text-lg font-bold text-nxt-w2">{record.name}</div>
                </div>
              </div>
            )
          })}
        </Grid>
      </div>
    </Flex>
  )
}
