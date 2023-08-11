import { faker } from '@faker-js/faker'
import { addMinutes, formatISO, subMinutes } from 'date-fns'
import { kebabCase, random, range, sample, sampleSize } from 'lodash'
import { Client } from 'pg'
import { createApi } from 'unsplash-js'
import { type Random } from 'unsplash-js/dist/methods/photos/types'

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_KEY!,
})

const db = new Client({
  connectionString: process.env.DATABASE_URL,
})

const main = async () => {
  await db.connect()

  // get photos from Unsplash
  const photosOne = await unsplash.photos.getRandom({
    count: 30,
  })
  const photosTwo = await unsplash.photos.getRandom({
    count: 30,
  })

  // transform into images
  const images = [
    ...(photosOne.response as Array<Random>),
    ...(photosTwo.response as Array<Random>),
  ].map((image) => ({
    hash: image.blur_hash ?? undefined,
    height: Math.round((1080 / image.width) * image.height),
    url: image.urls.regular,
    width: 1080,
  }))

  // delete all users
  await db.query('delete from auth.users')

  // create users
  const users = await Promise.all(
    range(100).map(async () => {
      const email = faker.internet.email().toLowerCase()
      const username = faker.internet.userName().toLowerCase()

      const result = await db.query<{
        id: string
      }>('select create_user($1, $2, $3) as id', [email, 'test1234', username])

      return result.rows[0].id
    }),
  )

  // delete all communities
  await db.query('delete from communities')

  // disable trigger
  await db.query('alter table communities disable trigger on_community_created')

  // create communities
  const communities = await Promise.all(
    [
      'Community',
      'Apple',
      'Candy',
      'Dubai',
      'Gaming',
      'JavaScript',
      'Mental Health',
      'Music',
      'Supabase',
      'Workspaces',
      'World of Warcraft',
    ].map(async (name) => {
      const slug = name === 'Community' ? 'community' : kebabCase(name)
      const description =
        name === 'Community'
          ? 'Official community for the Community app.'
          : faker.lorem.paragraph()

      const result = await db.query<{
        id: number
      }>(
        'insert into communities (slug, name, description) values ($1, $2, $3) returning id',
        [slug, name, description],
      )

      return result.rows[0].id
    }),
  )

  // enable trigger
  await db.query('alter table communities enable trigger on_community_created')

  // disable trigger
  await db.query('alter table posts disable trigger on_post_created')

  // create posts
  await Promise.all(
    range(1_000).map(async () => {
      const communityId = sample(communities)
      const userId = sample(users)
      const content = faker.lorem.paragraph()
      const date = subMinutes(new Date(), random(1440, 50_000))
      const meta = {
        images: sampleSize(images, random(0, 5)),
      }

      const result = await db.query<{
        id: string
      }>(
        'insert into posts (community_id, user_id, content, meta, created_at) values ($1, $2, $3, $4, $5) returning id',
        [communityId, userId, content, meta, date],
      )

      const postId = result.rows[0].id

      // create likes
      await Promise.all(
        range(random(5, 50)).map(() => {
          const userId = sample(users)
          const createdAt = formatISO(addMinutes(date, random(1, 45_000)))

          return db.query(
            'insert into likes (post_id, user_id, created_at) values ($1, $2, $3) on conflict do nothing',
            [postId, userId, createdAt],
          )
        }),
      )

      // create comments
      await Promise.all(
        range(random(5, 50)).map(() => {
          const userId = sample(users)
          const createdAt = formatISO(addMinutes(date, random(1, 45_000)))
          const content = faker.lorem.paragraph()

          return db.query(
            'insert into comments (post_id, user_id, content, created_at) values ($1, $2, $3, $4) on conflict do nothing',
            [postId, userId, content, createdAt],
          )
        }),
      )
    }),
  )

  // enable trigger
  await db.query('alter table posts enable trigger on_post_created')
}

main()
  .then(() => {
    console.log('done')
  })
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await db.end()
  })
