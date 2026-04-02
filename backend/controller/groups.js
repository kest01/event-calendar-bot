import { db } from '../db.js'

export function getGroupInfo(req, res) {
  const { group_id } = req.params
  
  if (!group_id) {
    return res.status(400).json({ error: 'group_id is required' })
  }
  
  db.get(
    `
    SELECT id, group_id, title, admins, created_at
    FROM groups
    WHERE group_id = ?
    `,
    [group_id],
    (err, row) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }
      
      if (!row) {
        console.error("Group not found " + group_id)
        return res.status(404).json({ error: 'Group not found' })
      }
      
      const group = {
        id: row.id,
        group_id: row.group_id,
        title: row.title,
        admins: row.admins ? JSON.parse(row.admins) : [],
        created_at: row.created_at
      }
      
      res.json(group)
    }
  )
}

export function moveGroups(req, res) {
  const { prev_group_id, new_group_id } = req.query
  
  if (!prev_group_id || !new_group_id) {
    return res.status(400).json({ error: 'prev_group_id and new_group_id is required' })
  }
  
  db.run(
    `
    UPDATE groups SET group_id = ? WHERE group_id = ?
    `,
    [new_group_id, prev_group_id],
    (err, row) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }
      
      console.log("Group " + prev_group_id + " is moved to " + new_group_id);

      db.run(
        `
        UPDATE events SET group_id = ? WHERE group_id = ?
        `,
        [new_group_id, prev_group_id],
        (err, row) => {
          if (err) {
            console.error(err.message)
            return res.status(500).json({ error: err.message })
          }
          
          console.log("Events from group " + prev_group_id + " is moved to " + new_group_id);
          res.json({ success: "Group and events is moved from group " + prev_group_id + " to " + new_group_id})
        }
      )
    }
  )
  
}
