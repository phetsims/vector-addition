// Copyright 2019-2024, University of Colorado Boulder

/**
 * GridBox lays out its children in a grid composed of cells. Children are provided in row-major order,
 * so cells are filled left-to-right, top-to-bottom.  All cells have the same dimensions, and alignment
 * of children within the cells can be specified.
 *
 * Adding/removing children does NOT change the contents of the grid, they will decorate the GridBox. To change the
 * contents of the grid, use setContents.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { AlignBox, AlignBoxXAlign, AlignBoxYAlign, AlignGroup, HBox, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';

type SelfOptions = {
  columns?: number; // number of columns
  xSpacing?: number; // horizontal spacing between cells
  ySpacing?: number; // vertical spacing between cells
  xAlign?: AlignBoxXAlign; // horizontal alignment of each Node in its cell, see X_ALIGN_VALUES
  yAlign?: AlignBoxYAlign; // vertical alignment of each Node in its cell, see Y_ALIGN_VALUES
};

type GridBoxOptions = SelfOptions;

export default class GridBox extends Node {

  private contents: Node[];
  private readonly vBox: VBox;
  private readonly columns: number;
  private readonly xSpacing: number;
  private readonly xAlign: AlignBoxXAlign;
  private readonly yAlign: AlignBoxYAlign;

  /**
   * @param contents - the contents of the grid, in row-major order
   * @param [providedOptions]
   */
  public constructor( contents: Node[], providedOptions?: GridBoxOptions ) {

    const options = optionize<GridBoxOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      columns: 2,
      xSpacing: 8,
      ySpacing: 8,
      xAlign: 'center',
      yAlign: 'center'
    }, providedOptions );

    assert && assert( options.columns > 0, `invalid columns: ${options.columns}` );

    const vBox = new VBox( {
      spacing: options.ySpacing,
      align: 'left'
    } );

    options.children = [ vBox ];

    super( options );

    this.contents = contents;
    this.vBox = vBox;
    this.columns = options.columns;
    this.xSpacing = options.xSpacing;
    this.xAlign = options.xAlign;
    this.yAlign = options.yAlign;

    this.setContents( contents );
  }

  /**
   * Gets the contents of the grid, in row-major order.
   */
  public getContents(): Node[] {
    return this.contents;
  }

  /**
   * Sets the contents of the grid, in row-major order.
   * @param contents - the contents of the grid, in row-major order
   */
  public setContents( contents: Node[] ): void {

    this.contents = contents;

    // Use an AlignGroup to ensure that every Node in the grid has the same effective bounds.
    const alignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Process the Nodes, in row-major order
    const vBoxChildren = [];
    let i = 0;
    while ( i < contents.length ) {

      const hBoxChildren = [];
      for ( let column = 0; column < this.columns && i < contents.length; column++ ) {

        // Wrap each child in an AlignBox, so that every Node in the grid has the same effective bounds,
        // and is aligned within those bounds as specified by options xAlign and yAlign.
        hBoxChildren.push( new AlignBox( contents[ i++ ], {
          group: alignGroup,
          xAlign: this.xAlign,
          yAlign: this.yAlign
        } ) );
      }

      vBoxChildren.push( new HBox( {
        children: hBoxChildren,
        spacing: this.xSpacing,
        align: 'origin'
      } ) );
    }

    this.vBox.children = vBoxChildren;
  }
}

vectorAddition.register( 'GridBox', GridBox );