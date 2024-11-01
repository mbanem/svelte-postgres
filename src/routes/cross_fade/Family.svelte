<script module lang="ts">
  export type Person = {
    firstName: string;
    lastName: string;
  };

  export type Family = {
    parents: [Person, Person];
    children: Person[];
  };
  export const Families: Array<Family> = [
    {
      parents: [
        { firstName: 'Ljubomir', lastName: 'Isakovic' },
        { firstName: 'Snezana', lastName: 'Isakovic' },
      ],
      children: [
        { firstName: 'Filip', lastName: 'Isakovic' },
        { firstName: 'Matia', lastName: 'Isakovic' },
      ],
    },
    {
      parents: [
        { firstName: 'Ljuban', lastName: 'Milutinovic' },
        { firstName: 'Tanja', lastName: 'Milutinovic' },
      ],
      children: [
        { firstName: 'Mia', lastName: 'Milutinovic' },
        { firstName: 'Marko', lastName: 'Milutinovic' },
      ],
    },
    {
      parents: [
        { firstName: 'Zeljko', lastName: 'Kotur' },
        { firstName: 'Dragana', lastName: 'Kotur' },
      ],
      children: [
        { firstName: 'Bojana', lastName: 'Kotur' },
        { firstName: 'Nikola', lastName: 'Kotur' },
      ],
    },
    {
      parents: [
        { firstName: 'Sasa', lastName: 'Krsmanovic' },
        { firstName: 'Mirjana', lastName: 'Krsmanovic' },
      ],
      children: [
        { firstName: 'Jovana', lastName: 'Krsmanovic' },
        { firstName: 'Milica', lastName: 'Krsmanovic' },
      ],
    },
  ];
  Families.forEach((f) => console.log(f.parents[0].lastName));
</script>
