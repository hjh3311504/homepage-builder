class Statement {
  text = '';

  join(table, fields, type = 'INNER') {
    let expression = Object.entries(fields).map((v) => `${v[0]}='${v[1]}'`);
    this.text += ` ${type} JOIN ${table} ON ${expression.join(' AND ')}`;
    return this;
  }

  where = (fields, operator = '=', separator = 'AND') => {
    if (typeof fields === 'string') {
      this.text += ` WHERE ${fields}`;
      return this;
    }

    let expression = Object.entries(fields).map((v) => `${v[0]}='${v[1]}'`);
    this.text += ` WHERE ${expression.join(` ${separator} `)}`;
    return this;
  };

  and = (fields, operator = '=', separator = 'AND') => {
    if (typeof fields === 'string') {
      this.text += ` AND ${fields}`;
      return this;
    }

    let expression = Object.entries(fields).map(
      (v) => `${v[0]}${operator}'${v[1]}'`
    );

    this.text += ` AND ${expression.join(` ${separator} `)}`;

    return this;
  };

  or = (fields, operator = '=', separator = 'AND') => {
    if (typeof fields === 'string') {
      this.text += ` OR ${fields}`;
      return this;
    }

    let expression = Object.entries(fields).map(
      (v) => `${v[0]}${operator}'${v[1]}'`
    );

    this.text += ` OR ${expression.join(` ${separator} `)}`;

    return this;
  };

  groupby = (columns) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    this.text += ` GROUP BY ${columns.join(', ')}`;
    return this;
  };

  having = (fields, operator = '=', separator = 'AND') => {
    let expression = Object.entries(fields).map(
      (v) => `${v[0]}${operator}'${v[1]}'`
    );
    this.text += ` HAVING ${expression.join(` ${separator} `)}`;
    return this;
  };

  orderby = (columns) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    this.text += ` ORDER BY ${columns.join(', ')}`;
    return this;
  };

  returning = (columns) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    this.text += ` RETURNING ${columns.join(', ')}`;
    return this;
  };

  limit = (limit, offset) => {
    if (!Number.isInteger(limit)) throw new Error('Limit should be a number');

    if (offset !== undefined && !Number.isInteger(offset))
      throw new Error('Offset should be a number or undefined');

    if (offset) {
      this.text += ` LIMIT ${offset}, ${limit}`;
    } else {
      this.text += ` LIMIT ${limit}`;
    }

    return this;
  };
}

exports.select = (table, columns) => {
  if (!Array.isArray(columns)) {
    columns = [columns];
  }

  let statement = new Statement();
  statement.operation = 'SELECT';
  statement.table = table;
  statement.text = `SELECT ${columns.join(', ')} FROM ${table}`;
  return statement;
};

exports.insert = (table, fields) => {
  let columns = Object.keys(fields);
  let values = Object.values(fields).map((v) => `'${v}'`);
  let statement = new Statement();
  statement.text = `INSERT INTO ${table} (${columns.join(
    ', '
  )}) VALUES (${values.join(', ')})`;
  return statement;
};

exports.update = (table, fields) => {
  let columns = Object.entries(fields).map((v) => `${v[0]}='${v[1]}'`);
  let statement = new Statement();
  statement.text = `UPDATE ${table} SET ${columns.join(', ')}`;
  return statement;
};

exports.deletes = (table) => {
  let statement = new Statement();
  statement.text = `DELETE FROM ${table}`;
  return statement;
};
