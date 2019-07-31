// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Lab' screen.
 *
 * Lab has a polar and a cartesian graph. Scene nodes are created to represent these graphs respectively.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class LabScreenView extends VectorAdditionScreenView {
    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      assert && assert( labModel instanceof LabModel, `invalid labModel: ${labModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );


      super( labModel, tandem );

      this.viewProperties = new VectorAdditionViewProperties();

      //----------------------------------------------------------------------------------------
      // Create the scenes for the polar and cartesian scenes.

      const polarSceneNode = new SceneNode( labModel.polarGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        labModel.componentStyleProperty );

      const cartesianSceneNode = new SceneNode( labModel.cartesianGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        labModel.componentStyleProperty );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel.polarGraph,
        polarSceneNode ) );

      cartesianSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel.cartesianGraph,
        cartesianSceneNode ) );


      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and explore2D scene is never disposed.
      this.viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );


      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( this.viewProperties.coordinateSnapModeProperty ) );

      //----------------------------------------------------------------------------------------
      // Create the Graph Control panel

      const labGraphControlPanel = new LabGraphControlPanel( this.viewProperties,
        labModel.cartesianGraph.vectorSet1,
        labModel.cartesianGraph.vectorSet2,
        labModel.polarGraph.vectorSet1,
        labModel.polarGraph.vectorSet2,
        labModel.componentStyleProperty );

      this.addChild( labGraphControlPanel );

      this.addChild( polarSceneNode );
      this.addChild( cartesianSceneNode );
    }

    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );