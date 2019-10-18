// Copyright 2019, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 1D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class Explore1DGraphControlPanel extends GraphControlPanel {

    /**
     * @param {VectorSet} horizontalVectorSet
     * @param {VectorSet} verticalVectorSet
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {Object} [options]
     */
    constructor( horizontalVectorSet, verticalVectorSet, viewProperties, options ) {

      assert && assert( horizontalVectorSet instanceof VectorSet, `invalid horizontalVectorSet: ${horizontalVectorSet}` );
      assert && assert( verticalVectorSet instanceof VectorSet, `invalid verticalVectorSet: ${verticalVectorSet}` );
      assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

      const horizontalSumCheckbox = new SumCheckbox( horizontalVectorSet.sumVisibleProperty,
        horizontalVectorSet.vectorColorPalette );

      const verticalSumCheckbox = new SumCheckbox( verticalVectorSet.sumVisibleProperty,
        verticalVectorSet.vectorColorPalette );

      // Show the Sum checkbox that matches the selected scene.
      // unlink is unnecessary, exists for the lifetime of the sim.
      viewProperties.graphOrientationProperty.link( gridOrientation => {
        horizontalSumCheckbox.visible = ( gridOrientation === GraphOrientations.HORIZONTAL );
        verticalSumCheckbox.visible = ( gridOrientation === GraphOrientations.VERTICAL );
      } );

      // Values
      const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty );

      // Grid
      const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty );

      // To make all checkboxes the same height
      const alignBoxOptions = {
        group: new AlignGroup( {
          matchHorizontal: false,
          matchVertical: true
        } )
      };

      super( [

        // checkboxes
        new VBox( {
          spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
          align: 'left',
          children: [
            new Node( {
              children: [
                new AlignBox( horizontalSumCheckbox, alignBoxOptions ),
                new AlignBox( verticalSumCheckbox, alignBoxOptions )
              ]
            } ),
            new AlignBox( valuesCheckbox, alignBoxOptions ),
            new AlignBox( gridCheckbox, alignBoxOptions )
          ]
        } )
      ], options );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );