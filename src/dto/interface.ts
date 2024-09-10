interface DTOMapper<T, U, Z> {
  mapFromRequest?: (request: T) => U
  mapToResponse?: (entity: U) => Z
}
export default DTOMapper
